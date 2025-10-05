import { IRequest, IResponse } from "../../../helpers/api.js";
import { UpdateCommunityPermissionsRequest } from "./updateCommunityPermissionsRequest.js";
import { NextFunction } from "express";
import { CommunityQueries } from "../../../database/queries/community.js";
import { updateCommunityPermissionsSecurity } from "./updateCommunityPermissionsSecurity.js";
import { checkSecurity } from "../../../helpers/security.js";
import { catchError } from "../../../helpers/errorLogging.js";

export const updateCommunityPermissionsHandler = async (req: IRequest<UpdateCommunityPermissionsRequest, "community">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const community = await CommunityQueries.getCommunityByIdQuery(requestModel?.id as string);
        if (checkSecurity(updateCommunityPermissionsSecurity(res, community))) {
            const { id, ...permissions } = requestModel as UpdateCommunityPermissionsRequest;
            const updatedCommunity = await CommunityQueries.updateCommunityPermissionsQuery(id, permissions);
            req.community = updatedCommunity;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, updateCommunityPermissionsHandler.name);
    }
};