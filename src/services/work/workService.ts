import { Permissions } from "../../helpers/permissions.js";
import { cacheNamespaceVersion } from "../../infrastructure/redisCache.js";
import { communityAccess, projectAccess } from "../../security/domainAccess.js";
import type { Response as ExpressResponse } from "express";
export {
    objectId,
    key,
    workStatusValidationScheme,
    workFieldValidationScheme,
    workConfigurationValidationScheme,
    savedWorkViewValidationScheme,
    workTemplateValidationScheme,
} from "../../validators/schemes/workValidationSchemes.js";

export function invalid(response: ExpressResponse, error: Error) {
    response.status(400).json({ code: 400, message: error.message });
}
export async function scopedAccess(userId: string, communityId: string, projectId?: string) {
    if (projectId) {
        const context = await projectAccess(userId, projectId, "tasks", [
            Permissions.READ_OWN,
            Permissions.READ_OTHER,
        ]);
        return context?.project.communityId === communityId ? context : undefined;
    }
    return communityAccess(userId, communityId, "tasks", [Permissions.READ_OWN, Permissions.READ_OTHER]);
}
export function workConfigurationNamespace(communityId: string): string {
    return `work-configurations:${communityId}`;
}
export async function workConfigurationCacheKey(communityId: string, projectId?: string): Promise<string> {
    const namespace = workConfigurationNamespace(communityId);
    const version = await cacheNamespaceVersion(namespace);
    return `${namespace}:${projectId ?? "community"}:v${version}`;
}
