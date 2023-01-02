import { cleanUpModel } from "../../responses/responseHelper.js";
import { ErrorResponseModel } from "../../responses/models/API/errorResponseModel.js";

const prepareErrorResponse = (errorStatus, message) => {

    const model = new ErrorResponseModel({
        message: message ?? errorStatus.message,
        statusCode: errorStatus.code,
    });
    return cleanUpModel(model);
};

export {
    prepareErrorResponse,
};