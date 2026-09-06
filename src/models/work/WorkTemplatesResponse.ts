import type { IWorkTemplate } from "../../database/models/work/IWorkTemplate.js";
import { WorkTemplateResponse } from "./WorkTemplateResponse.js";

export class WorkTemplatesResponse extends Array<WorkTemplateResponse> {
    constructor(values: IWorkTemplate[]) {
        super(...values.map((template) => new WorkTemplateResponse(template)));
    }
}
