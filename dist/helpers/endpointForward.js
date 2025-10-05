"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpointForward = void 0;
const endpointForward = (req, res) => {
    return res.status(req.statusCode ?? 404).json(req.presenterModel);
};
exports.endpointForward = endpointForward;
