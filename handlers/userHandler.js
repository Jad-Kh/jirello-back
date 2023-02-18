import { getUsersOfCommunityQuery } from "../database/queries/user/userQueries.js";
import { getCommunityByIdQuery } from "../database/queries/community/communityQueries.js";
import pkg from "lodash";
import { prepareErrorLog } from "../errorLog/errorLog.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { UserErrorResponses } from "../responses/messages/errors/user/userErrorResponse.js";
import { CommunityErrorResponses } from "../responses/messages/errors/community/communityErrorResponse.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";

const { isEmpty } = pkg;

const getCommunityUsersHandler = async (req, res, next) => {
    try {
        const communityId = req.requestModel.id;
        const community = await getCommunityByIdQuery(communityId);
        if (isEmpty(community)) {
            return res.status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
              .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
        }
        const communityUsers = await getUsersOfCommunityQuery(communityId);
        const users = await Promise.all(
            communityUsers.map(user => {
                let role = "user";
                if (community.ownerIds.includes(user._id)) {
                    role = "owner";
                }
                return { user, role };
            }),
        );
        req.users = users;
        next();
    } catch(error) {
        prepareErrorLog(error, getCommunityUsersHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
          .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

export {
    getCommunityUsersHandler
}