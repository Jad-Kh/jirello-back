export type IConversationRead = {
    userId: string;
    scopeType: "community" | "project";
    scopeId: string;
    lastReadAt: Date;
};
