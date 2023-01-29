import { UserModel } from "../../models/user/user.js";

const createUser = async (body) => {
    return await UserModel(body).save();
};

const getUserByEmail = async (email) => {
    const checked_email = email.toLowerCase();
    const user = await UserModel.findOne({
        "profile.email": checked_email,
    });
    return user;
};

const getUserByUserName = async (username) => {
    const user = await UserModel.findOne({
        "profile.username": username,
    });
    return user;
};

export {
    createUser,
    getUserByEmail,
    getUserByUserName,
}