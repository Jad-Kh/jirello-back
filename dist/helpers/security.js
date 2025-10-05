"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSecurity = void 0;
const checkSecurity = (check) => {
    if (typeof check === "boolean" && check)
        return true;
    else
        return check;
};
exports.checkSecurity = checkSecurity;
