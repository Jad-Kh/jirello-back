export type InvitationStatus = "pending" | "accepted" | "declined" | "expired";

export type ICommunityInvitation = {
    communityId: string;
    invitedUserId: string;
    invitedBy: string;
    status: InvitationStatus;
    expiresAt: Date;
    respondedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
};
