import { RoleSuccessResponses } from "../responses/messages/success/role/roleSuccessResponses.js";

const assignRoleToUserPresenter = async (req, res, next) => {
    req.statusCode = RoleSuccessResponses.ASSIGN_USER_TO_ROLE_SUCCESS.code;
    req.presenterModel = prepareSuccessResponse(
        RoleSuccessResponses.ASSIGN_USER_TO_ROLE_SUCCESS,
        null,
        { }
    );
    next();
};

const removeUserFromRolePresenter = async (req, res, next) => {
    req.statusCode = RoleSuccessResponses.REMOVE_USER_FROM_ROLE_SUCCESS.code;
    req.presenterModel = prepareSuccessResponse(
        RoleSuccessResponses.REMOVE_USER_FROM_ROLE_SUCCESS,
        null,
        { }
    );
    next();
};

export {
    assignRoleToUserPresenter,
    removeUserFromRolePresenter
}