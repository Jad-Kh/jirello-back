import type { IPortalComment } from "../../database/models/portal/IPortalComment.js";
import { PortalCommentResponse } from "./PortalCommentResponse.js";

export class PortalCommentsResponse extends Array<PortalCommentResponse> {
    constructor(values: IPortalComment[]) {
        super(...values.map((comment) => new PortalCommentResponse(comment)));
    }
}
