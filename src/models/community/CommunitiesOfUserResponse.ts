import { CommunityResponse } from "./CommunityResponse.ts";

export class CommunitiesOfUserResponse {
    communities: CommunityResponse[];

    constructor(values: CommunitiesOfUserResponse) {
        this.communities = values.communities;
    }
}