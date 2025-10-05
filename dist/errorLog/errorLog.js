"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareErrorLog = void 0;
const prepareErrorLog = (error, functionName) => {
    const errorMessage = error.message ?? error ?? "Empty Error";
    const separator = "\n----------------------------------\n";
    console.log(`${separator}Error In ${functionName}\nError Message: ${errorMessage}${separator}`);
};
exports.prepareErrorLog = prepareErrorLog;
