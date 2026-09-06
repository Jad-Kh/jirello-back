import { respondToInvitationValidationScheme } from "../../../services/invitation/invitationService.js";

export type RespondToInvitationRequest = ReturnType<
    typeof respondToInvitationValidationScheme.validate
>["value"];
