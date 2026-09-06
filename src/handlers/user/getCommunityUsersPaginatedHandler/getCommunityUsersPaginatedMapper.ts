import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { UserResponse } from "../../../models/user/UserResponse.js";
import { UsersOfCommunityResponse } from "../../../models/user/UsersOfCommunityResponse.js";

export const getCommunityUsersPaginatedMapper = async (
    community: ICommunity,
    communityUsers: IUser[],
): Promise<UsersOfCommunityResponse> => {
    const users: UsersOfCommunityResponse["users"] = communityUsers.map((user: IUser) => {
        const role = community.ownerIds.includes(user.id as string) ? "owner" : "user";
        return {
            user: new UserResponse(user as unknown as UserResponse),
            role,
        };
    });
    return new UsersOfCommunityResponse(users);
};
