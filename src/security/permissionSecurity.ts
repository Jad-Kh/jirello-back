import { IUser } from "../database/models/user/IUser.ts";
import { ICommunity } from "../database/models/community/ICommunity.ts";
import {
    aggregatePermissions,
    createMaxRolePermissionResponse,
    createPermissionsResponse
} from "../helpers/permissions.ts";
import { RoleQueries } from "../database/queries/role.ts";
import { isEmpty } from "lodash";
import { IRole } from "../database/models/role/IRole.ts";
import { IRequest, IResponse } from "../helpers/api.ts";
import { PERMISSIONS_MAP } from "../helpers/permissionsMap.ts";
import { NextFunction } from "express";
import { CommonErrorResponses } from "../responses/errors/CommonErrorResponses.ts";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.ts";
import { CommunityQueries } from "../database/queries/community.ts";
import { UserQueries } from "../database/queries/user.ts";
import { prepareErrorLog } from "../errorLog/errorLog.ts";

async function getUserEffectivePermissions(user: IUser, community: ICommunity) {
    if (user.isAdmin || (user.id && community.ownerIds.includes(user.id))) {
        return createMaxRolePermissionResponse();
    }
    if (user.roles?.priorityRoleId) {
        const priorityRole = await RoleQueries.getRoleByIdQuery(user.roles.priorityRoleId.toString());
        if (!isEmpty(priorityRole)) {
            return createPermissionsResponse(priorityRole.permissionOverrides);
        }
    }
    const userRolesInCommunity = await RoleQueries.getRolesOfUserInCommunityQuery(community.id as string, user.id as string);
    if (userRolesInCommunity.length > 0) {
        const overrideRoles = userRolesInCommunity.filter((r: IRole) => r.overrideAll);
        const rolesToConsider = overrideRoles.length > 0 ? overrideRoles : userRolesInCommunity;
        return aggregatePermissions(rolesToConsider);
    }
    return createPermissionsResponse(community.permissions);
}

function getRequiredPermission(routePattern: string, method: string, req: IRequest<any, "user">) {
    const permissionEntry = PERMISSIONS_MAP[routePattern]?.[method];
    if (!permissionEntry) {
        return null;
    }
    return typeof permissionEntry === 'function' ? permissionEntry(req) : permissionEntry;
}

export const permissionSecurity = async (req: IRequest<any, "user">, res: IResponse, next: NextFunction) => {
    try {
        const activeCommunityId = req.header("activeCommunityId") as string;
        if (!activeCommunityId) {
            return res.status(CommonErrorResponses.UNAUTHORIZED.code).json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, "Active community ID required."));
        }
        const community = await CommunityQueries.getCommunityByIdQuery(activeCommunityId);
        if (isEmpty(community)) {
            return res.status(CommonErrorResponses.UNAUTHORIZED.code).json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, "Invalid community."));
        }
        const user = req.user ? req.user : await UserQueries.getUserByIdQuery(req.userId as string);
        if (isEmpty(user)) {
            return res.status(CommonErrorResponses.UNAUTHORIZED.code).json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
        }
        req.user = user;
        const userPermissions = await getUserEffectivePermissions(user, community);
        const requiredPermission = getRequiredPermission(req.route.path, req.method, req);
        if (!requiredPermission?.domain || !requiredPermission.permissions) {
            return res.status(CommonErrorResponses.UNAUTHORIZED.code).json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
        }
        if (requiredPermission.permissions.length === 0) {
            return next();
        }
        const { domain, permissions } = requiredPermission;
        const hasPermission = permissions.some((perm: any) => userPermissions[domain]?.has(perm));
        if (!hasPermission) {
            return res.status(CommonErrorResponses.UNAUTHORIZED.code).json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, "Insufficient permissions."));
        }
        return next();
    } catch (error) {
        prepareErrorLog(error, "permissionSecurity");
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};