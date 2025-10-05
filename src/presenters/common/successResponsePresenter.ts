import { cleanUpModel } from "../../responses/responseHelper.js";
import { SuccessResponse } from "../../models/api/SuccessResponse.ts";

const prepareSuccessResponse = <T>(successStatus: SuccessResponse<T>, message: string | null, data: T) => {
    const model = new SuccessResponse({
        data: data,
        message: message ?? successStatus.message,
        code: successStatus.code,
    });
    return cleanUpModel(model);
};

export {
    prepareSuccessResponse,
};