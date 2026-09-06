import { reportError } from "../helpers/errorReporter.js";

const prepareErrorLog = (error: unknown, functionName: string): void => {
    reportError(error, { operation: functionName });
};

export { prepareErrorLog };
