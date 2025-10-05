"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityResponse = void 0;
const APISignature_ts_1 = require("../api/APISignature.ts");
class CommunityResponse extends APISignature_ts_1.APISignature {
    name;
    flag;
    ownerIds;
    userIds;
    projectIds;
    roleIds;
    screenIds;
    template;
    validationLevel;
    requiredValidationLevel;
    constructor(values) {
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
exports.CommunityResponse = CommunityResponse;
