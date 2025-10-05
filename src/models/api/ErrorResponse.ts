export class ErrorResponse {
    message: string;
    code: number;

    constructor(values: ErrorResponse) {
        this.message = values.message;
        this.code = values.code;
    }
}