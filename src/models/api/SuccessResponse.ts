export class SuccessResponse<T> {
    data?: T;
    message: string;
    code: number;

    constructor(values: SuccessResponse<T>) {
        this.data = values?.data;
        this.message = values.message;
        this.code = values.code;
    }
}