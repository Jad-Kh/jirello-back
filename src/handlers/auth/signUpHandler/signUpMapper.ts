import { SignUpRequest } from "./signUpRequest.js";
import { UserResponse } from "../../../models/user/UserResponse.js";
import bcrypt from "bcrypt";

export const signUpMapper = async (requestModel: SignUpRequest): Promise<UserResponse> => {
    const isAdmin = false;
    const communityIds: string[] = [];
    const ownedCommunityIds: string[] = [];
    const taskIds: string[] = [];
    const taskGroupIds: string[] = [];
    const taskPerWeekAverage = 0;
    const tasks = { taskIds, taskGroupIds, taskPerWeekAverage };
    const mutedCommunityIds: string[] = [];
    const mutedChatIds: string[] = [];
    const muteAll = false;
    const notifications = { mutedCommunityIds, mutedChatIds, muteAll };
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(requestModel.password, salt);
    requestModel.password = hashedPassword;
    return {
        isAdmin,
        communityIds,
        ownedCommunityIds,
        profile: requestModel,
        tasks,
        notifications
    };
};