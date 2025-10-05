import { IRequest, IResponse } from "../../../helpers/api.js";
import { NextFunction } from "express";
import { APISignature } from "../../../models/api/APISignature.js";
import { CommunityQueries } from "../../../database/queries/community.js";
import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { checkSecurity } from "../../../helpers/security.js";
import { getCommunityRolesSecurity } from "./getCommunityRolesSecurity.js";
import { RoleQueries } from "../../../database/queries/role.js";
import { catchError } from "../../../helpers/errorLogging.js";

export const getCommunityRolesHandler = async (req: IRequest<APISignature, "roles">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const community = await CommunityQueries.getCommunityByIdQuery(requestModel?.id as string) as ICommunity;
        if (checkSecurity(getCommunityRolesSecurity(res, community))) {
            const roles = await RoleQueries.getRolesOfCommunityQuery(requestModel?.id as string);
            req.roles = roles;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, getCommunityRolesHandler.name);
    }
};