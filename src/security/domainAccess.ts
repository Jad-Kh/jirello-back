import { CommunityQueries } from "../database/queries/community.js";
import { ProjectQueries } from "../database/queries/project.js";
import { UserQueries } from "../database/queries/user.js";
import { hasPermission, type Permission, type PermissionDomain } from "../helpers/permissions.js";
import { getUserEffectivePermissions } from "./permissionSecurity.js";
import { isCommunityMember } from "./resourceSecurity.js";

export async function communityAccess(
    userId: string,
    communityId: string,
    domain: PermissionDomain,
    required: readonly Permission[],
) {
    const [community, user] = await Promise.all([
        CommunityQueries.getCommunityByIdQuery(communityId),
        UserQueries.getUserByIdQuery(userId),
    ]);
    if (!community || !user || !isCommunityMember(community, userId)) return undefined;
    const permissions = await getUserEffectivePermissions(user, community);
    if (
        !user.isAdmin &&
        !community.ownerIds.map(String).includes(userId) &&
        !hasPermission(permissions, domain, required)
    ) {
        return undefined;
    }
    return { community, user, permissions };
}

export async function projectAccess(
    userId: string,
    projectId: string,
    domain: PermissionDomain,
    required: readonly Permission[],
) {
    const project = await ProjectQueries.getProjectByIdQuery(projectId);
    if (!project) return undefined;
    const context = await communityAccess(userId, project.communityId, domain, required);
    return context ? { ...context, project } : undefined;
}

export function isCommunityManager(
    context: {
        user: { isAdmin?: boolean };
        community: { ownerIds: string[] };
    },
    userId: string,
): boolean {
    return Boolean(context.user.isAdmin || context.community.ownerIds.map(String).includes(userId));
}
