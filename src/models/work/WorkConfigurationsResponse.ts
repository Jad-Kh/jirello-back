import type { IWorkConfiguration } from "../../database/models/work/IWorkConfiguration.js";
import { WorkConfigurationResponse } from "./WorkConfigurationResponse.js";

export class WorkConfigurationsResponse extends Array<WorkConfigurationResponse> {
    constructor(values: IWorkConfiguration[]) {
        super(...values.map((configuration) => new WorkConfigurationResponse(configuration)));
    }
}
