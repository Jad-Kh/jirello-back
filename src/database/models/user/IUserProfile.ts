import { ICommon } from "../ICommon.ts";

export type IUserProfile = ICommon & {
    username: string;
    firstName: string;
    lastName: string;
    birthday: string;
    email: string;
    password: string;
}