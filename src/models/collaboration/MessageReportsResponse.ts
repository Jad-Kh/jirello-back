import type { IMessageReport } from "../../database/models/collaboration/IMessageReport.js";
import { MessageReportResponse } from "./MessageReportResponse.js";

export class MessageReportsResponse extends Array<MessageReportResponse> {
    constructor(values: IMessageReport[]) {
        super(...values.map((report) => new MessageReportResponse(report)));
    }
}
