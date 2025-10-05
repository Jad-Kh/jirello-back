import { IRequest, IResponse } from "../../../helpers/api.js";
import { NextFunction } from "express";
import { RoleQueries } from "../../../database/queries/role.js";
import { checkSecurity } from "../../../helpers/security.js";
import { getRoleUsersSecurity } from "./getRoleUsersSecurity.js";
import { UserQueries } from "../../../database/queries/user.js";
import { APISignature } from "../../../models/api/APISignature.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { IRole } from "../../../database/models/role/IRole.js";

export const getRoleUsersHandler = async (req: IRequest<APISignature, "users">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const roleId = req.requestModel?.id as string;
        const role = await RoleQueries.getRoleByIdQuery(roleId);
        if (checkSecurity(getRoleUsersSecurity(res, role as IRole))) {
            const roleUsers = await UserQueries.getUsersByRoleIdQuery(roleId);
            req.users = roleUsers;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, getRoleUsersHandler.name);
    }
};