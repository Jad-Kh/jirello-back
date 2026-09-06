import { createInvitationValidationScheme } from "../../../services/invitation/invitationService.js";

export type CreateInvitationRequest = ReturnType<typeof createInvitationValidationScheme.validate>["value"];
