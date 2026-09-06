import { rateLimit } from "express-rate-limit";
import { CommunityQueries } from "../../database/queries/community.js";
import { ProjectQueries } from "../../database/queries/project.js";
import { UserQueries } from "../../database/queries/user.js";
import { hasPermission, Permissions } from "../../helpers/permissions.js";
import { RealtimeChannels } from "../../realtime/channels.js";
import { getUserEffectivePermissions } from "../../security/permissionSecurity.js";
import { isCommunityMember } from "../../security/resourceSecurity.js";
export {
    objectId,
    collaborationScopeValidationScheme,
    createMessageValidationScheme,
    updateMessageValidationScheme,
    reportMessageValidationScheme,
    reviewMessageReportValidationScheme,
} from "../../validators/schemes/collaborationValidationSchemes.js";

export const messageWriteRateLimit = rateLimit({
    windowMs: 60_000,
    limit: 60,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { code: 429, message: "Too many collaboration messages." },
});

type CollaborationScopeInput = { projectId?: string; communityId?: string };

export async function resolveScope(userId: string, input: CollaborationScopeInput) {
    const project = input.projectId ? await ProjectQueries.getProjectByIdQuery(input.projectId) : undefined;
    const communityId = input.communityId ?? project?.communityId;
    const [community, user] = await Promise.all([
        communityId ? CommunityQueries.getCommunityByIdQuery(communityId) : undefined,
        UserQueries.getUserByIdQuery(userId),
    ]);
    if (!community || !user || !isCommunityMember(community, user.id)) return undefined;
    if (project) {
        const permissions = await getUserEffectivePermissions(user, community);
        if (!hasPermission(permissions, "projects", [Permissions.READ_OTHER])) return undefined;
    }
    return {
        user,
        community,
        project,
        scopeType: project ? ("project" as const) : ("community" as const),
        scopeId: project?.id ?? community.id,
        channel: project ? RealtimeChannels.project(project.id) : RealtimeChannels.community(community.id),
    };
}
export function socketId(value: unknown): string | undefined {
    return typeof value === "string" && /^\d+\.\d+$/.test(value) ? value : undefined;
}
