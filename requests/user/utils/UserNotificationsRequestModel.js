class UserNotificationsRequestModel {
    mutedCommunitiyIds = undefined;
    mutedChatIds = undefined;
    muteAll = undefined;

    constructor(values) {
        this.mutedCommunitiyIds = values.mutedCommunitiyIds;
        this.mutedChatIds = values.mutedChatIds;
        this.muteAll = values.muteAll;
    }
}

export {
    UserNotificationsRequestModel
}