import { UserModel } from "../../models/user/user";
import { applyActiveFilters } from "../../queriesFilter/queriesFilter";

const createUser = async (body) => {
    return await UserModel(body).save();
};

export {
    createUser
}