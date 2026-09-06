import { IRequest, IResponse } from "./api.js";

export const endpointForward = (req: IRequest<unknown, "presenterModel">, res: IResponse) => {
    return res.status(req.statusCode ?? 404).json(req.presenterModel);
};
