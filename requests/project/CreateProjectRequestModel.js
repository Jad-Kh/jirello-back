class CreateProjectRequestModel {
    name = undefined;
    communityId = undefined;

    constructor(values) {
        this.name = values.name;
        this.communityId = values.communityId;
    }
}

export {
    CreateProjectRequestModel
}