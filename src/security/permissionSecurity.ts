import { Request, RequestHandler } from "express";
import { ICommunity } from "../database/models/community/ICommunity.js";
import { IUser } from "../database/models/user/IUser.js";
import { CommunityQueries } from "../database/queries/community.js";
import { RoleQueries } from "../database/queries/role.js";
import { UserQueries } from "../database/queries/user.js";
import { IRequest, IResponse } from "../helpers/api.js";
import {
    aggregatePermissions,
    createMaxRolePermissionResponse,
    createPermissionsResponse,
    hasPermission,
    PermissionDomain,
    PermissionSet,
} from "../helpers/permissions.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { CommonErrorResponses } from "../responses/errors/CommonErrorResponses.js";

type CommunityIdResolver = (request: Request) => string | undefined;

const normalizeIds = (ids: string[]): string[] => ids.map(String);

export async function getUserEffectivePermissions(
    user: IUser,
    community: ICommunity,
): Promise<PermissionSet> {
    const userId = user.id!;
    if (user.isAdmin || normalizeIds(community.ownerIds).includes(userId)) {
        return createMaxRolePermissionResponse();
    }

    if (user.roles?.priorityRoleId) {
        const priorityRole = await RoleQueries.getRoleByIdQuery(user.roles.priorityRoleId);
        if (priorityRole && priorityRole.communityId === community.id) {
            return createPermissionsResponse(priorityRole.permissionOverrides);
        }
    }

    const roles = await RoleQueries.getRolesOfUserInCommunityQuery(community.id!, userId);
    if (roles.length > 0) {
        const overridingRoles = roles.filter((role) => role.overrideAll);
        return aggregatePermissions(overridingRoles.length > 0 ? overridingRoles : roles);
    }

    return createPermissionsResponse(community.permissions);
}

function deny(response: IResponse, status: 401 | 403, message: string): void {
    const error = status === 401 ? CommonErrorResponses.UNAUTHORIZED : CommonErrorResponses.FORBIDDEN;
    response.status(status).json(prepareErrorResponse(error, message));
}

export function requireCommunityPermission(
    domain: PermissionDomain,
    permissions: readonly number[],
    resolveCommunityId: CommunityIdResolver = (request) => request.header("activeCommunityId") ?? undefined,
): RequestHandler {
    return async (request, response, next): Promise<void> => {
        const req = request as IRequest<unknown, never>;
        try {
            if (!req.userId) {
                deny(response, 401, "Authentication required.");
                return;
            }

            const communityId = resolveCommunityId(req);
            if (!communityId) {
                deny(response, 403, "Community context required.");
                return;
            }

            const [community, user] = await Promise.all([
                CommunityQueries.getCommunityByIdQuery(communityId),
                UserQueries.getUserByIdQuery(req.userId),
            ]);
            if (!community || !user) {
                deny(response, 403, "Community access denied.");
                return;
            }

            const memberIds = [...normalizeIds(community.ownerIds), ...normalizeIds(community.userIds)];
            if (!user.isAdmin && !memberIds.includes(user.id)) {
                deny(response, 403, "Community membership required.");
                return;
            }

            const effectivePermissions = await getUserEffectivePermissions(user, community);
            if (permissions.length > 0 && !hasPermission(effectivePermissions, domain, permissions)) {
                deny(response, 403, "Insufficient permissions.");
                return;
            }

            req.user = user;
            req.community = community;
            next();
        } catch (error) {
            next(error);
        }
    };
}

export const requireSelf: RequestHandler = (request, response, next): void => {
    const req = request as IRequest<unknown, never>;
    if (req.userId !== req.params.id) {
        deny(response, 403, "You can only access your own resource.");
        return;
    }
    next();
};
