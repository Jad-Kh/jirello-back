export type ICommonId = {
    id?: string;
}

export type ICommonTimeStamps = {
    createdAt?: string;
    updatedAt?: string;
}

export type ICommon = ICommonId & ICommonTimeStamps;