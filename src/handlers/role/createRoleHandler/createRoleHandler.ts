import { IRequest, IResponse } from "../../../helpers/api.js";
import { NextFunction } from "express";
import { RoleRequest } from "./createRoleRequest.js";
import { RoleQueries } from "../../../database/queries/role.js";
import { IRole } from "../../../database/models/role/IRole.js";
import { checkSecurity } from "../../../helpers/security.js";
import { createRoleSecurity } from "./createRoleSecurity.js";
import { createRoleMapper } from "./createRoleMapper.js";
import { RoleResponse } from "../../../models/role/RoleResponse.js";
import { catchError } from "../../../helpers/errorLogging.js";

export const createRoleHandler = async (req: IRequest<RoleRequest, "role">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const roleByTitle = await RoleQueries.getRoleByTitleQuery(requestModel?.title as string) as IRole;
        if (checkSecurity(createRoleSecurity(res, roleByTitle, requestModel?.communityId as string))) {
            const mappedRole = createRoleMapper(requestModel as RoleRequest, req.userId as string);
            const newRole = new RoleResponse(mappedRole);
            const savedRole = await RoleQueries.createRoleQuery(newRole as IRole);
            req.role = savedRole;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, createRoleHandler.name);
    }
};
