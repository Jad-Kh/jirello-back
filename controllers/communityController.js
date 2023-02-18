const communityController = (req, res) => {
    return res.status(req.statusCode).json(req.presenterModel);
};

export {
    communityController
};