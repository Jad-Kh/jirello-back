import { APISignature } from "../api/APISignature.js";

export class UserProfileResponse extends APISignature {
    username: string;
    firstName: string;
    lastName: string;
    birthday: string;
    email: string;

    constructor(values: UserProfileResponse) {
        super(values);
        this.username = values.username;
        this.firstName = values.firstName;
        this.lastName = values.lastName;
        this.birthday = values?.birthday;
        this.email = values.email;
    }
}
