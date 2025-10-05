import { cleanUpModel } from "../../responses/responseHelper.js";
import { ErrorLogType } from "../../helpers/errorLogging.ts";
import { ErrorResponse } from "../../models/api/ErrorResponse.ts";

const prepareErrorResponse = (errorStatus: ErrorLogType, message: string | null) => {
    const model = new ErrorResponse({
        message: message ?? errorStatus.message,
        code: errorStatus.code,
    });
    return cleanUpModel(model);
};

export {
    prepareErrorResponse,
};