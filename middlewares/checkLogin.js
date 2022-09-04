const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkLogin = (req, res, next) => {
    try {
        if (!req.headers.authorization) throw new Error(" Authorization token is missing");
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.AUTH_KEY);

        if (!decoded) throw new Error(" AUthorization failed");

        res.locals.username = decoded.username;

        next();
    } catch (error) {
        res.locals.username = null;
        next();
    }
};

module.exports = checkLogin;
