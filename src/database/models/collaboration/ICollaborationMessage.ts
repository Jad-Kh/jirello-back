export type CollaborationKind = "chat" | "comment";

export type ICollaborationMessage = {
    kind: CollaborationKind;
    scopeType: "community" | "project";
    scopeId: string;
    communityId: string;
    projectId?: string;
    authorId: string;
    body: string;
    parentId?: string;
    mentionedUserIds: string[];
    version: number;
    editedAt?: Date;
    deletedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
};
