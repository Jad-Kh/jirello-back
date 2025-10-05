"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionSecurity = void 0;
const permissions_ts_1 = require("../helpers/permissions.ts");
const role_ts_1 = require("../database/queries/role.ts");
const lodash_1 = require("lodash");
const permissionsMap_ts_1 = require("../helpers/permissionsMap.ts");
const CommonErrorResponses_ts_1 = require("../responses/errors/CommonErrorResponses.ts");
const errorResponsePresenter_ts_1 = require("../presenters/common/errorResponsePresenter.ts");
const community_ts_1 = require("../database/queries/community.ts");
const user_ts_1 = require("../database/queries/user.ts");
const errorLog_ts_1 = require("../errorLog/errorLog.ts");
async function getUserEffectivePermissions(user, community) {
    if (user.isAdmin || (user.id && community.ownerIds.includes(user.id))) {
        return (0, permissions_ts_1.createMaxRolePermissionResponse)();
    }
    if (user.roles?.priorityRoleId) {
        const priorityRole = await role_ts_1.RoleQueries.getRoleByIdQuery(user.roles.priorityRoleId.toString());
        if (!(0, lodash_1.isEmpty)(priorityRole)) {
            return (0, permissions_ts_1.createPermissionsResponse)(priorityRole.permissionOverrides);
        }
    }
    const userRolesInCommunity = await role_ts_1.RoleQueries.getRolesOfUserInCommunityQuery(community.id, user.id);
    if (userRolesInCommunity.length > 0) {
        const overrideRoles = userRolesInCommunity.filter((r) => r.overrideAll);
        const rolesToConsider = overrideRoles.length > 0 ? overrideRoles : userRolesInCommunity;
        return (0, permissions_ts_1.aggregatePermissions)(rolesToConsider);
    }
    return (0, permissions_ts_1.createPermissionsResponse)(community.permissions);
}
function getRequiredPermission(routePattern, method, req) {
    const permissionEntry = permissionsMap_ts_1.PERMISSIONS_MAP[routePattern]?.[method];
    if (!permissionEntry) {
        return null;
    }
    return typeof permissionEntry === 'function' ? permissionEntry(req) : permissionEntry;
}
const permissionSecurity = async (req, res, next) => {
    try {
        const activeCommunityId = req.header("activeCommunityId");
        if (!activeCommunityId) {
            return res.status(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED.code).json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED, "Active community ID required."));
        }
        const community = await community_ts_1.CommunityQueries.getCommunityByIdQuery(activeCommunityId);
        if ((0, lodash_1.isEmpty)(community)) {
            return res.status(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED.code).json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED, "Invalid community."));
        }
        const user = req.user ? req.user : await user_ts_1.UserQueries.getUserByIdQuery(req.userId);
        if ((0, lodash_1.isEmpty)(user)) {
            return res.status(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED.code).json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED, null));
        }
        req.user = user;
        const userPermissions = await getUserEffectivePermissions(user, community);
        const requiredPermission = getRequiredPermission(req.route.path, req.method, req);
        if (!requiredPermission?.domain || !requiredPermission.permissions) {
            return res.status(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED.code).json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED, null));
        }
        if (requiredPermission.permissions.length === 0) {
            return next();
        }
        const { domain, permissions } = requiredPermission;
        const hasPermission = permissions.some((perm) => userPermissions[domain]?.has(perm));
        if (!hasPermission) {
            return res.status(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED.code).json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED, "Insufficient permissions."));
        }
        return next();
    }
    catch (error) {
        (0, errorLog_ts_1.prepareErrorLog)(error, "permissionSecurity");
        return res.status(CommonErrorResponses_ts_1.CommonErrorResponses.SERVER_ERROR.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommonErrorResponses_ts_1.CommonErrorResponses.SERVER_ERROR, null));
    }
};
exports.permissionSecurity = permissionSecurity;
