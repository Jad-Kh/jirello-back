export const cleanUpModel = (model) => {
    const modelJSONString = JSON.stringify(model);
    return JSON.parse(modelJSONString, (key, value) => {
        if (value !== null) return value;
    });
};

export const removeFalsyKeys = (model) => {
    let newObj = {};
    Object.keys(model).forEach((prop) => {
        if (model[prop]) {
            newObj[prop] = model[prop];
        }
    });
    return newObj;
};