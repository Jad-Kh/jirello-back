export type ICommonId = {
    id?: string;
};

export type ICommonTimeStamps = {
    createdAt?: Date;
    updatedAt?: Date;
};

export type ICommon = ICommonId & ICommonTimeStamps;
