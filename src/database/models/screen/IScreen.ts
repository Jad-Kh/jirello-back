import { ICommon } from "../ICommon.js";

export type IScreen = ICommon & {
    title: string;
    url: string;
    communityId: string;
    password?: string;
    protected: boolean;
    allowedUserIds: string[];
};
