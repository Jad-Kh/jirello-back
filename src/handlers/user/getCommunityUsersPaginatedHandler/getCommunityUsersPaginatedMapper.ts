import { IUser } from "../../../database/models/user/IUser.js";
import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { UsersOfCommunityResponse } from "../../../models/user/UsersOfCommunityResponse.js";
import {UserResponse} from "../../../models/user/UserResponse.js";

export const getCommunityUsersPaginatedMapper = async (community: ICommunity, communityUsers: IUser[]): Promise<UsersOfCommunityResponse[]> => {
    return communityUsers.map((user: IUser) => {
        const role = community.ownerIds.includes(user.id as string) ? "owner" : "user";
        return {
            user: user as UserResponse,
            role
        };
    });
};