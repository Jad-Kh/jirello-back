import { CustomHelpers } from "joi";
import { UserErrorResponses } from "../../responses/errors/UserErrorResponses.ts";
import { CommonErrorResponses } from "../../responses/errors/CommonErrorResponses.ts";

export const emailValidation = (value: string, helpers: CustomHelpers) => {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (value.match(regexEmail)) {
        return value;
    } else {
        return helpers.message({ custom: UserErrorResponses.EMAIL_ERROR.message });
    }
};

export const passwordValidation = (value: string, helpers: CustomHelpers) => {
    if (value) {
        if (value.length < 8) {
            return helpers.message({ custom: UserErrorResponses.PASSWORD_LENGTH_ERROR.message });
        } else {
            return value;
        }
    } else {
        return helpers.message({ custom: CommonErrorResponses.REQUIRED.message });
    }
};

export const dateValidation = (value: string, helpers: CustomHelpers) => {
    let regexDate = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    if (value.match(regexDate)) {
        return value;
    } else {
        return helpers.message({ custom: UserErrorResponses.DATE_ERROR.message });
    }
}