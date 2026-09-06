import type { ConfigureClientPortalRequest } from "../handlers/portal/configureClientPortalHandler/configureClientPortalRequest.js";
import type { GrantGuestAccessRequest } from "../handlers/portal/grantGuestAccessHandler/grantGuestAccessRequest.js";
import type { CreateDeliverableRequest } from "../handlers/portal/createDeliverableHandler/createDeliverableRequest.js";
import type { DecideDeliverableRequest } from "../handlers/portal/decideDeliverableHandler/decideDeliverableRequest.js";
import type { UpdateDeliverableRequest } from "../handlers/portal/updateDeliverableHandler/updateDeliverableRequest.js";
import type { GetClientCommentsRequest } from "../handlers/portal/getClientCommentsHandler/getClientCommentsRequest.js";
import type { CreateClientCommentRequest } from "../handlers/portal/createClientCommentHandler/createClientCommentRequest.js";
import { createValidator } from "../helpers/validator.js";
import { PortalErrorResponses } from "../responses/errors/PortalErrorResponses.js";
import {
    getClientCommentsValidationScheme,
    updateDeliverableValidationScheme,
    decideDeliverableValidationScheme,
    createClientCommentValidationScheme,
    createDeliverableValidationScheme,
    grantGuestAccessValidationScheme,
    configureClientPortalValidationScheme,
} from "./schemes/portalValidationSchemes.js";

export const getClientCommentsValidator = createValidator<GetClientCommentsRequest>(
    getClientCommentsValidationScheme,
    PortalErrorResponses.VALIDATION_ERROR,
);

export const updateDeliverableValidator = createValidator<UpdateDeliverableRequest>(
    updateDeliverableValidationScheme,
    PortalErrorResponses.VALIDATION_ERROR,
);

export const decideDeliverableValidator = createValidator<DecideDeliverableRequest>(
    decideDeliverableValidationScheme,
    PortalErrorResponses.VALIDATION_ERROR,
);

export const createClientCommentValidator = createValidator<CreateClientCommentRequest>(
    createClientCommentValidationScheme,
    PortalErrorResponses.VALIDATION_ERROR,
);

export const createDeliverableValidator = createValidator<CreateDeliverableRequest>(
    createDeliverableValidationScheme,
    PortalErrorResponses.VALIDATION_ERROR,
);

export const grantGuestAccessValidator = createValidator<GrantGuestAccessRequest>(
    grantGuestAccessValidationScheme,
    PortalErrorResponses.VALIDATION_ERROR,
);

export const configureClientPortalValidator = createValidator<ConfigureClientPortalRequest>(
    configureClientPortalValidationScheme,
    PortalErrorResponses.VALIDATION_ERROR,
);
