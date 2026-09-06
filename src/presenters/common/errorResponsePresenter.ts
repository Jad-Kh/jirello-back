import { ErrorLogType } from "../../helpers/errorLogging.js";
import { ErrorResponse } from "../../models/api/ErrorResponse.js";
import { cleanUpModel } from "../../responses/responseHelper.js";

const prepareErrorResponse = (errorStatus: ErrorLogType, message: string | null) => {
    const model = new ErrorResponse({
        message: message ?? errorStatus.message,
        code: errorStatus.code,
    });
    return cleanUpModel(model);
};

export { prepareErrorResponse };
