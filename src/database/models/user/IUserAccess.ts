import { ICommon } from "../ICommon.ts";

export type IUserAccess = ICommon & {
    refreshToken: string;
}