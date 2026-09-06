import { runCpuWorkValidationScheme } from "../../../validators/schemes/learningValidationSchemes.js";

export type RunCpuWorkRequest = ReturnType<typeof runCpuWorkValidationScheme.validate>["value"];
