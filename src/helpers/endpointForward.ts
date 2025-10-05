import { IRequest, IResponse } from "./api.js";

export const endpointForward = (req: IRequest<any, "presenterModel">, res: IResponse) => {
    return res.status(req.statusCode ?? 404).json(req.presenterModel);
};