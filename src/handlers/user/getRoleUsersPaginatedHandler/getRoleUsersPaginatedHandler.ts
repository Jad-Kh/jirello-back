import { IRequest, IResponse } from "../../../helpers/api.js";
import { NextFunction } from "express";
import { RoleQueries } from "../../../database/queries/role.js";
import { checkSecurity } from "../../../helpers/security.js";
import { getRoleUsersPaginatedSecurity } from "./getRoleUsersPaginatedSecurity.js";
import { UserQueries } from "../../../database/queries/user.js";
import { APISignature } from "../../../models/api/APISignature.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { IRole } from "../../../database/models/role/IRole.js";
import { preparePagination } from "../../../helpers/pagination.js";

export const getRoleUsersHandler = async (req: IRequest<APISignature, "users">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const roleId = req.requestModel?.id as string;
        const role = await RoleQueries.getRoleByIdQuery(roleId);
        if (checkSecurity(getRoleUsersPaginatedSecurity(res, role as IRole))) {
            const { skip, limit } = preparePagination(req.query);
            const roleUsers = await UserQueries.getUsersByRoleIdPaginatedQuery(roleId, skip, limit);
            req.users = roleUsers;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, getRoleUsersHandler.name);
    }
};