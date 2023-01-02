class APISignatureResponseModel {
    createdAt = undefined;
    updatedAt = undefined;

    constructor(values) {
        this.createdAt = values?.createdAt;
        this.updatedAt = values?.updatedAt;
    }
}

export {
    APISignatureResponseModel,
};