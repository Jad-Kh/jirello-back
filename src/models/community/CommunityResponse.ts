import { PermissionsResponse } from "../permissions/PermissionsResponse.ts";
import { APISignature } from "../api/APISignature.ts";

export class CommunityResponse extends APISignature {
    name: string;
    flag: string;
    ownerIds: string[];
    userIds: string[];
    projectIds: string[];
    roleIds?: string[];
    screenIds?: string[];
    template?: string;
    validationLevel?: number;
    requiredValidationLevel?: number;

    constructor(values: CommunityResponse) {
        super(values);
        this.name = values?.name;
        this.flag = values?.flag;
        this.ownerIds = values?.ownerIds;
        this.userIds = values?.projectIds;
        this.projectIds = values?.projectIds;
        this.roleIds = values?.roleIds ?? [];
        this.screenIds = values?.screenIds ?? [];
        this.template = values?.template;
        this.validationLevel = values?.validationLevel;
        this.requiredValidationLevel = values?.requiredValidationLevel;
    }
}