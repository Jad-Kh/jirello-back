import type { IWorkConfiguration } from "../../database/models/work/IWorkConfiguration.js";
import { APISignature } from "../api/APISignature.js";

export class WorkConfigurationResponse extends APISignature {
    communityId: string;
    projectId?: string;
    key: string;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    statuses: IWorkConfiguration["statuses"];
    fields: IWorkConfiguration["fields"];
    transitions: IWorkConfiguration["transitions"];
    isDefault: boolean;
    archivedAt?: Date;
    version: number;

    constructor(values: IWorkConfiguration) {
        super(values);
        this.communityId = values.communityId;
        this.projectId = values.projectId;
        this.key = values.key;
        this.name = values.name;
        this.description = values.description;
        this.color = values.color;
        this.icon = values.icon;
        this.statuses = values.statuses;
        this.fields = values.fields;
        this.transitions = values.transitions;
        this.isDefault = values.isDefault;
        this.archivedAt = values.archivedAt;
        this.version = values.version;
    }
}
