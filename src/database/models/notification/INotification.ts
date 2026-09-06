export type INotification = {
    recipientId: string;
    type: string;
    title: string;
    body: string;
    actorId?: string;
    communityId?: string;
    projectId?: string;
    conversationId?: string;
    resourceType?: string;
    resourceId?: string;
    readAt?: Date;
    dedupeKey?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
