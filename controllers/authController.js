const authController = (req, res) => {
    return res.status(req.statusCode).json(req.presenterModel);
};

export {
    authController
};