import { IRequest, IResponse } from "../../../helpers/api.js";
import { NextFunction } from "express";
import { RemoveUserFromRoleRequest } from "./removeUserFromRoleRequest.js";
import { RoleQueries } from "../../../database/queries/role.js";
import { UserQueries } from "../../../database/queries/user.js";
import { checkSecurity } from "../../../helpers/security.js";
import { removeUserFromRoleSecurity } from "./removeUserFromRoleSecurity.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { IRole } from "../../../database/models/role/IRole.js";
import { IUser } from "../../../database/models/user/IUser.js";

export const removeUserFromRoleHandler = async (req: IRequest<RemoveUserFromRoleRequest, "role">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const role = await RoleQueries.getRoleByIdQuery(requestModel!.roleId) as IRole;
        const user = await UserQueries.getUserByIdQuery(requestModel!.userId) as IUser;
        if (checkSecurity(removeUserFromRoleSecurity(res, role, user, requestModel!.userId))) {
            await RoleQueries.removeUserFromRoleQuery(requestModel!.roleId, requestModel!.userId);
            await UserQueries.removeRoleFromUserQuery(requestModel!.userId, requestModel!.roleId);
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, removeUserFromRoleHandler.name);
    }
};