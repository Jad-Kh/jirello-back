import { UserProfileRequestModel } from "./utils/UserProfileRequestModel.js";
import { UserTasksRequestModel } from "./utils/UserTasksRequestModel.js";
import { UserNotificationsRequestModel } from "./utils/UserNotificationsRequestModel.js";

class CreateUserRequestModel {
    profile = undefined;
    isAdmin = undefined;
    ownedCommunityIds = undefined;
    tasks = undefined;
    notifications = undefined;

    constructor(values) {
      this.profile = new UserProfileRequestModel(values.profile);
      this.isAdmin = values.isAdmin;
      this.ownedCommunityIds = values.ownedCommunityIds;
      this.tasks = new UserTasksRequestModel(values.tasks);
      this.notifications = new UserNotificationsRequestModel(values.notifications);
    }
}
  
export {
    CreateUserRequestModel
}