class ErrorResponseModel {
    message = undefined;
    statusCode = undefined;
    
    constructor(values) {
        this.message = values.message;
        this.statusCode = values.statusCode;
    }
}

export {
    ErrorResponseModel,
};