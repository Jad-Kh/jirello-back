const prepareErrorLog = (error, functionName) => {
    const errorMessage = error.message ?? error ?? "Empty Error";
    const separator = "\n----------------------------------\n";
    console.log(
        `${separator}Error In ${functionName}\nError Message: ${errorMessage}${separator}`
    );
};

export {
    prepareErrorLog,
};