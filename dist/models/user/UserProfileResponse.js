"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileResponse = void 0;
const APISignature_ts_1 = require("../api/APISignature.ts");
class UserProfileResponse extends APISignature_ts_1.APISignature {
    username;
    firstName;
    lastName;
    birthday;
    email;
    constructor(values) {
        super(values);
        this.username = values.username;
        this.firstName = values.firstName;
        this.lastName = values.lastName;
        this.birthday = values?.birthday;
        this.email = values.email;
    }
}
exports.UserProfileResponse = UserProfileResponse;
