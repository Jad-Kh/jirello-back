import { IRequest, IResponse } from "../../../helpers/api.ts";
import { UpdateProjectRequest } from "./updateProjectRequest.ts";
import { NextFunction } from "express";
import { ProjectQueries } from "../../../database/queries/project.ts";
import { IProject } from "../../../database/models/project/IProject.ts";
import { checkSecurity } from "../../../helpers/security.ts";
import { updateProjectSecurity } from "./updateProjectSecurity.ts";
import { catchError } from "../../../helpers/errorLogging.ts";

export const updateProjectHandler = async (req: IRequest<UpdateProjectRequest, "project">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const project = await ProjectQueries.getProjectByIdQuery(requestModel?.id as string) as IProject;
        if (checkSecurity(updateProjectSecurity(res, project, req.userId as string))) {
            const { id, ...updateModel } = requestModel as UpdateProjectRequest;
            const updatedProject = await ProjectQueries.updateProjectQuery(id, updateModel);
            req.project = updatedProject;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, updateProjectHandler.name);
    }
};
