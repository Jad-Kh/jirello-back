import { UserProfileResponseModel } from "./utils/UserProfileResponseModel.js";
import { UserTasksResponseModel } from "./utils/UserTasksResponseModel.js";
import { UserNotificationsResponseModel } from "./utils/UserNotificationsResponseModel.js";
import { APISignatureResponseModel } from "../API/APISignatureResponseModel.js";

class UserResponseModel extends APISignatureResponseModel {
    profile = undefined;
    isAdmin = undefined;
    ownedCommunityIds = undefined;
    tasks = undefined;
    notifications = undefined;

    constructor(values) {
      super(values);
      this.profile = new UserProfileResponseModel(values.profile);
      this.isAdmin = values.isAdmin;
      this.ownedCommunityIds = values.ownedCommunityIds;
      this.tasks = new UserTasksResponseModel(values.tasks);
      this.notifications = new UserNotificationsResponseModel(values.notifications);
    }
}
  
export {
    UserResponseModel
}