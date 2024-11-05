class CreateRoleRequestModel {
    title = undefined;
    communityId = undefined;
    parentRoleId = undefined;
    priorityPosition = undefined;
    projectBased = undefined;

    constructor(values) {
        this.title = values.title;
        this.communityId = values.communityId;
        this.parentRoleId = values?.parentRoleId;
        this.priorityPosition = values.priorityPosition;
        this.projectBased = values?.projectBased;
    }
}

export {
    CreateRoleRequestModel
}