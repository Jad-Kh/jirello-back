import type { ISavedWorkView } from "../../database/models/work/ISavedWorkView.js";
import { SavedWorkViewResponse } from "./SavedWorkViewResponse.js";

export class SavedWorkViewsResponse extends Array<SavedWorkViewResponse> {
    constructor(values: ISavedWorkView[]) {
        super(...values.map((view) => new SavedWorkViewResponse(view)));
    }
}
