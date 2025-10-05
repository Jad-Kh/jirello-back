import { IRequest, IResponse } from "../../../helpers/api.js";
import { NextFunction } from "express";
import { AssignRoleToUserRequest } from "./assignRoleToUserRequest.js";
import { RoleQueries } from "../../../database/queries/role.js";
import { UserQueries } from "../../../database/queries/user.js";
import { IRole } from "../../../database/models/role/IRole.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { checkSecurity } from "../../../helpers/security.js";
import { assignRoleToUserSecurity } from "./assignRoleToUserSecurity.js";
import { catchError}  from "../../../helpers/errorLogging.js";

export const assignRoleToUserHandler = async (req: IRequest<AssignRoleToUserRequest, "role">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const role = await RoleQueries.getRoleByIdQuery(requestModel!.roleId) as IRole;
        const user = await UserQueries.getUserByIdQuery(requestModel!.userId) as IUser;
        if (checkSecurity(assignRoleToUserSecurity(res, role, user, requestModel!.userId))) {
            await RoleQueries.addUserToRoleQuery(requestModel!.roleId, requestModel!.userId);
            await UserQueries.assignRoleToUserQuery(requestModel!.userId, requestModel!.roleId);
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, assignRoleToUserHandler.name);
    }
};