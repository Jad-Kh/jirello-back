import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";
import { prepareErrorLog } from "../errorLog/errorLog.js";
import { getCommunityByIdQuery } from "../database/queries/community/communityQueries.js";
import { getRoleByIdQuery, getRolesOfUserInCommunityQuery } from "../database/queries/role/roleQueries.js";
import { isEmpty } from "lodash";
import { aggregatePermissions, createMaxRolePermissionResponse, createPermissionsResponse } from "../helpers/permissions.js";
import { PERMISSIONS_MAP } from "../helpers/permissionsMap.js";

const permissionSecurity = async (req, res, next) => {
    try {
        const activeCommunityId = req.header("activeCommunityId");
        const community = await getCommunityByIdQuery(activeCommunityId);
        if(isEmpty(community)) {
            return res.status(CommonErrorResponses.UNAUTHORIZED.code)
                .json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
        } else {
            const user = req.user;
            let userPermissions = null;
            if(user.isAdmin || community.ownerIds.includes(user._id)) {
                userPermissions = createMaxRolePermissionResponse();
            }
            const priorityRole = await getRoleByIdQuery(user.userRoles.priorityRoleId);
            if(!isEmpty(priorityRole)) {
                userPermissions = createPermissionsResponse(priorityRole.permissionOverrides);
            }   
            const userRolesInCommunity = await getRolesOfUserInCommunityQuery(activeCommunityId, user._id);  
            const overrideAllRoles = userRolesInCommunity.filter((r) => r.overrideAll);
            const roles = overrideAllRoles.length > 0 ? overrideAllRoles : userRolesInCommunity;
            if(roles.length > 0) {
                userPermissions = aggregatePermissions(roles);
            } else {
                userPermissions = createPermissionsResponse(community.permissions);
            }
            const route = `${req.baseUrl}${req.path}`;
            const method = req.method;
            const permissionEntry = PERMISSIONS_MAP[route]?.[method];
            if (!permissionEntry) {
                return res.status(CommonErrorResponses.UNAUTHORIZED.code)
                    .json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
            }
            const { domain, permissions } = typeof permissionEntry === 'function' ? permissionEntry(req) : permissionEntry;
            if (!domain || !permissions) {
                return res.status(CommonErrorResponses.UNAUTHORIZED.code)
                    .json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
            }
            const hasPermission = permissions.some((perm) => userPermissions[domain]?.has(perm));
            if (!hasPermission) {
                return res.status(CommonErrorResponses.UNAUTHORIZED.code)
                    .json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
            }
            next();
        }
    } catch (error) {
        prepareErrorLog(error, permissionSecurity.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null)); 
    }
};

export {
    permissionSecurity
};