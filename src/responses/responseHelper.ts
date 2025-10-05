export const cleanUpModel = (model: any) => {
    const modelJSONString = JSON.stringify(model);
    return JSON.parse(modelJSONString, (key, value) => {
        if (value !== null) return value;
    });
};