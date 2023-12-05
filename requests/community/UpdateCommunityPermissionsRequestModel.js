import { CommunityPermissionsRequestModel } from "./utils/CommunityPermissionsRequestModel.js";

class UpdateCommunityPermissionsRequestModel extends CommunityPermissionsRequestModel {
    id = undefined;

    constructor(values) {
        super(values);
        this.id = values.id;
    }
};

export {
    UpdateCommunityPermissionsRequestModel
}