import { Request, Response } from "express";

export type IRequest<T, S extends string | number | symbol> = Request & {
    requestModel?: T;
    userId?: string;
} & (S extends never ? {} : { [K in S]: any })

export type IResponse = Response;