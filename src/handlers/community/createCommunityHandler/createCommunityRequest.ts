export type CommunityRequest = {
    name: string;
    flag: string;
    ownerIds: string[];
    userIds: string[];
    projectIds: string[];
    template: string;
    roleIds: string[];
    screenIds: string[];
    validationLevel: number;
    requiredValidationLevel: number;
}