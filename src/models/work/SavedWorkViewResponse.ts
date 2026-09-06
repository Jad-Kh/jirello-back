import type { ISavedWorkView } from "../../database/models/work/ISavedWorkView.js";
import { APISignature } from "../api/APISignature.js";

export class SavedWorkViewResponse extends APISignature {
    communityId: string;
    projectId?: string;
    ownerId: string;
    name: string;
    visibility: ISavedWorkView["visibility"];
    layout: ISavedWorkView["layout"];
    filters: Record<string, unknown>;
    sort: ISavedWorkView["sort"];
    groupBy?: string;

    constructor(values: ISavedWorkView) {
        super(values);
        this.communityId = values.communityId;
        this.projectId = values.projectId;
        this.ownerId = values.ownerId;
        this.name = values.name;
        this.visibility = values.visibility;
        this.layout = values.layout;
        this.filters = values.filters;
        this.sort = values.sort;
        this.groupBy = values.groupBy;
    }
}
