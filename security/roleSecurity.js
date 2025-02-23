import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";
import { prepareErrorLog } from "../errorLog/errorLog.js";
import { getCommunityByIdQuery } from "../database/queries/community/communityQueries";
import { getRoleByIdQuery, getRolesOfUserInCommunityQuery } from "../database/queries/role/roleQueries.js";
import { isEmpty } from "lodash";
import { aggregatePermissions, createMaxRolePermissionResponse, createPermissionsResponse } from "../helpers/permissions.js";

const roleSecurity = async (req, res, next) => {
    try {
        const activeCommunityId = req.header("activeCommunityId");
        const community = await getCommunityByIdQuery(activeCommunityId);
        if(isEmpty(community)) {
            return res.status(CommonErrorResponses.UNAUTHORIZED.code)
                .json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
        } else {
            const user = req.user;
            if(user.isAdmin || community.ownerIds.includes(user._id)) {
                req.userPermissions = createMaxRolePermissionResponse();
                return next();
            }
            const priorityRole = await getRoleByIdQuery(user.userRoles.priorityRoleId);
            if(!isEmpty(priorityRole)) {
                req.userPermissions = createPermissionsResponse(priorityRole.permissionOverrides);
                return next();
            }
            const userRolesInCommunity = await getRolesOfUserInCommunityQuery(activeCommunityId, user._id);  
            const overrideAllRoles = userRolesInCommunity.filter((r) => r.overrideAll);
            const roles = overrideAllRoles.length > 0 ? overrideAllRoles : userRolesInCommunity;
            if(roles.length > 0) {
                req.userPermissions = aggregatePermissions(roles);
                return next();
            } else {
                req.userPermissions = createPermissionsResponse(community.permissions);
                return next();
            }
        }
    } catch (error) {
        prepareErrorLog(error, roleSecurity.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null)); 
    }
};

export {
    roleSecurity
}