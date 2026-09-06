import { Request, Response } from "express";

export type IRequest<T, _S extends string | number | symbol> = Request<Record<string, string>> & {
    requestModel?: T;
};

export type IResponse = Response;
