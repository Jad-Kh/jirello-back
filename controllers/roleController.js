const roleController = (req, res) => {
    return res.status(req.statusCode).json(req.presenterModel);
};

export {
    roleController
};