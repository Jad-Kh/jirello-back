export const cleanUpModel = (model: unknown): unknown => {
    const modelJSONString = JSON.stringify(model);
    return JSON.parse(modelJSONString, (_key, value) => {
        if (value !== null) return value;
    });
};
