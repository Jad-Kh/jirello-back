import { IResponse } from "./api.js";

type CheckResult<T> = T extends true ? true : IResponse;

export const checkSecurity = <T extends boolean | IResponse>(check: T): CheckResult<T> => {
    if (typeof check === "boolean" && check) {
        return true as CheckResult<T>;
    }
    return check as CheckResult<T>;
};