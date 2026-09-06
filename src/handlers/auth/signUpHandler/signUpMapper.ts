import bcrypt from "bcrypt";
import { IUser } from "../../../database/models/user/IUser.js";
import { SignUpRequest } from "./signUpRequest.js";

export const signUpMapper = async (requestModel: SignUpRequest): Promise<IUser> => {
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
    return {
        isAdmin,
        communityIds,
        ownedCommunityIds,
        profile: {
            ...requestModel,
            email: requestModel.email.trim().toLowerCase(),
            username: requestModel.username.trim(),
            password: hashedPassword,
        },
        tasks,
        notifications,
    };
};
