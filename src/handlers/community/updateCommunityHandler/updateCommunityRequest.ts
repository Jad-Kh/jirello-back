export type UpdateCommunityRequest = {
    id: string;
    name?: string;
    flag?: string;
    template?: string;
    validationLevel?: number;
    requiredValidationLevel?: number;
};
