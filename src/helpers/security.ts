import { IResponse } from "./api.js";

export const checkSecurity = (check: boolean | IResponse): check is true => check === true;
