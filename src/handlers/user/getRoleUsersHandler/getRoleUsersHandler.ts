import { NextFunction } from "express";
import { IRole } from "../../../database/models/role/IRole.js";
import { RoleQueries } from "../../../database/queries/role.js";
import { UserQueries } from "../../../database/queries/user.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { checkSecurity } from "../../../helpers/security.js";
import { APISignature } from "../../../models/api/APISignature.js";
import { authorizeResourceCommunity } from "../../../security/resourceSecurity.js";
import { getRoleUsersSecurity } from "./getRoleUsersSecurity.js";

export const getRoleUsersHandler = async (
    req: IRequest<APISignature, "users">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const roleId = req.requestModel?.id as string;
        const role = await RoleQueries.getRoleByIdQuery(roleId);
        if (role && !authorizeResourceCommunity(res, req.community, role.communityId)) return;
        if (checkSecurity(getRoleUsersSecurity(res, role as IRole))) {
            const roleUsers = await UserQueries.getUsersByRoleIdQuery(roleId);
            req.users = roleUsers;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, getRoleUsersHandler.name);
    }
};
