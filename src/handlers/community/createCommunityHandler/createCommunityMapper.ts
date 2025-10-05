import { CommunityRequest } from "./createCommunityRequest.js";
import { CommunityResponse } from "../../../models/community/CommunityResponse.js";

export const createCommunityMapper = async (community: CommunityRequest, userId: string): Promise<CommunityResponse> => {
    const ownerIds: string[] = [userId];
    const userIds: string[] = [];
    const projectIds: string[] = [];
    const template: string = community?.template ?? "Normal";
    const roleIds: string[] = [];
    const screenIds: string[] = [];
    const validationLevel: number = 0;
    const requiredValidationLevel: number = 0;

    return {
        name: community.name,
        flag: community.flag,
        ownerIds,
        userIds,
        projectIds,
        template,
        roleIds,
        screenIds,
        validationLevel,
        requiredValidationLevel
    };
};
