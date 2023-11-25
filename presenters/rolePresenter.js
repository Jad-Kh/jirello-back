import { RoleSuccessResponses } from "../responses/messages/success/role/roleSuccessResponses";

const assignRoleToUserPresenter = async (req, res, next) => {
    req.statusCode = RoleSucc;
    req.presenterModel = prepareSuccessResponse(
        RoleSuccessResponses.ASSIGN_USER_TO_ROLE_SUCCESS,
        null,
        { }
    );
    next();
};

export {
    assignRoleToUserPresenter
}