export class APISignature {
    readonly id?: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(values: APISignature) {
        this.id = values?.id;
        this.createdAt = values?.createdAt;
        this.updatedAt = values?.updatedAt;
    }
}