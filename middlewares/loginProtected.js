const jwt = require("jsonwebtoken");
require("dotenv").config();

const loginProtected = (req, res, next) => {
    try {
        if (!req.headers.authorization) throw new Error(" AUthorization token is missing");
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.AUTH_KEY);

        if (!decoded) throw new Error(" AUthorization failed");

        res.locals.username = decoded.username;
        
        next();
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
};

module.exports = loginProtected;
