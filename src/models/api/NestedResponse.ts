export class NestedResponse<T> {
    data: T;
    children?: NestedResponse<T>[];

    constructor(values: NestedResponse<T>) {
        this.data = values.data;
        this.children = values?.children;
    }
}