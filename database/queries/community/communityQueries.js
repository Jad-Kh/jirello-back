import { CommunityModel } from "../../models/community/community.js"

const createCommunityQuery = async (body) => {
    return await CommunityModel(body).save();
};

const getCommunityByIdQuery = async (id) => {
    const community = await CommunityModel.findOne({
        _id: id,
    });
    return community;
}

export {
    createCommunityQuery,
    getCommunityByIdQuery
}