import type { CreateInvitationRequest } from "../handlers/invitation/createInvitationHandler/createInvitationRequest.js";
import type { RespondToInvitationRequest } from "../handlers/invitation/respondToInvitationHandler/respondToInvitationRequest.js";
import { createValidator } from "../helpers/validator.js";
import { InvitationErrorResponses } from "../responses/errors/InvitationErrorResponses.js";
import {
    respondToInvitationValidationScheme,
    createInvitationValidationScheme,
} from "./schemes/invitationValidationSchemes.js";

export const respondToInvitationValidator = createValidator<RespondToInvitationRequest>(
    respondToInvitationValidationScheme,
    InvitationErrorResponses.VALIDATION_ERROR,
);

export const createInvitationValidator = createValidator<CreateInvitationRequest>(
    createInvitationValidationScheme,
    InvitationErrorResponses.VALIDATION_ERROR,
);
