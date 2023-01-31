import { UserModel } from "../../models/user/user.js";

const createUserQuery = async (body) => {
    return await UserModel(body).save();
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

export {
    createUserQuery,
    getUserByEmailQuery,
    getUserByUsernameQuery,
}