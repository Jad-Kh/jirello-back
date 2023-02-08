import { UserModel } from "../../models/user/user.js";
import { CommunityModel } from "../../models/community/community.js"

const createUserQuery = async (body) => {
    return await UserModel(body).save();
};

const getUserByIdQuery = async (id) => {
    const user = await UserModel.findOne({
        _id: id,
    });
    return user;
};

const getUserByEmailQuery = async (email) => {
    const checked_email = email.toLowerCase();
    const user = await UserModel.findOne({
        "profile.email": checked_email,
    });
    return user;
};

const getUserByUsernameQuery = async (username) => {
    const user = await UserModel.findOne({
        "profile.username": username,
    });
    return user;
};

const getUsersOfCommunityQuery = async (communityId) => {
    const community = await CommunityModel.findById(communityId).select("userIds ownerIds");
    const userIds = [...community.userIds, ...community.ownerIds];
    const users = await UserModel.find({ 
        _id: { $in: userIds } 
    }).select("profile");
    return users;    
};

export {
    createUserQuery,
    getUserByIdQuery,
    getUserByEmailQuery,
    getUserByUsernameQuery,
    getUsersOfCommunityQuery,
}