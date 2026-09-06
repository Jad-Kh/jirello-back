import type { IWorkTemplate } from "../../database/models/work/IWorkTemplate.js";
import { APISignature } from "../api/APISignature.js";

export class WorkTemplateResponse extends APISignature {
    communityId: string;
    projectId?: string;
    name: string;
    description?: string;
    createdBy: string;
    typeKey: string;
    defaults: Record<string, unknown>;

    constructor(values: IWorkTemplate) {
        super(values);
        this.communityId = values.communityId;
        this.projectId = values.projectId;
        this.name = values.name;
        this.description = values.description;
        this.createdBy = values.createdBy;
        this.typeKey = values.typeKey;
        this.defaults = values.defaults;
    }
}
