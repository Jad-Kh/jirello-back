import { SuccessResponse } from "../../models/api/SuccessResponse.js";
import { cleanUpModel } from "../../responses/responseHelper.js";

const prepareSuccessResponse = <T>(
    successStatus: Pick<SuccessResponse<T>, "message" | "code">,
    message: string | null,
    data: T,
) => {
    const model = new SuccessResponse({
        data: data,
        message: message ?? successStatus.message,
        code: successStatus.code,
    });
    return cleanUpModel(model);
};

export { prepareSuccessResponse };
