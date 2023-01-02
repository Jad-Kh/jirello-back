class SuccessResponseModel {
    data = undefined;
    message = undefined;
    statusCode = undefined;
    
    constructor(values) {
        this.data = values.data;
        this.message = values.message;
        this.statusCode = values.statusCode;
    }
}

export {
    SuccessResponseModel,
};