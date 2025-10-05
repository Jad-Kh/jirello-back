import { IRequest, IResponse } from "../../../helpers/api.js";
import { NextFunction } from "express";
import { UpdateRoleRequest } from "./updateRoleRequest.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { RoleQueries } from "../../../database/queries/role.js";
import { checkSecurity } from "../../../helpers/security.js";
import { IRole } from "../../../database/models/role/IRole.js";
import { updateRoleSecurity } from "./updateRoleSecurity.js";

export const updateRoleHandler = async (req: IRequest<UpdateRoleRequest, "role">, res: IResponse, next: NextFunction) => {
    try {
        const requestModel = req.requestModel;
        const role = await RoleQueries.getRoleByIdQuery(requestModel?.id as string) as IRole;
        if(checkSecurity(updateRoleSecurity(res, role))) {
            const { id, ...updateModel } = requestModel as UpdateRoleRequest;
            const updatedRole = await RoleQueries.updateRoleQuery(id, updateModel);
            req.role = updatedRole;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, updateRoleHandler.name);
    }
};