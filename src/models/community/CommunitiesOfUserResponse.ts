import { CommunityResponse } from "./CommunityResponse.js";

export class CommunitiesOfUserResponse {
    communities: CommunityResponse[];

    constructor(values: CommunitiesOfUserResponse | CommunityResponse[]) {
        const communities = Array.isArray(values) ? values : values.communities;
        this.communities = communities.map((community) => new CommunityResponse(community));
    }
}
