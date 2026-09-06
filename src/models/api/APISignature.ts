export class APISignature {
    readonly id?: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(values: APISignature & { _id?: { toString(): string } | string }) {
        this.id = values?.id ?? values?._id?.toString();
        this.createdAt = values?.createdAt;
        this.updatedAt = values?.updatedAt;
    }
}
