import { cleanUpModel } from "../../responses/responseHelper.js";
import { SuccessResponseModel } from "../../responses/models/API/successResponseModel.js";

const prepareSuccessResponse = (successStatus, message, data) => {

    const model = new SuccessResponseModel({
        data: data,
        message: message ?? successStatus.message,
        statusCode: successStatus.code,
    });
    return cleanUpModel(model);
};

export {
    prepareSuccessResponse,
};