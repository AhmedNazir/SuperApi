// External Modules
const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
var config = {
    apiKey: "test-d3fff4ca-c36e-447e-8390-206f5950631d",
};
var ma = require("mojoauth-sdk")(config);
// Internal Modules
const UserModel = require("../models/UserModel");

// Router
const router = express.Router();

router.get("/", (req, res) => {
    res.render("auth");
});

router.post("/login", async (req, res) => {
    try {
        // Paas your JWT token from frontend
        var jwtToken = process.env.AUTH_KEY;
        ma.mojoAPI
            .verifyToken(jwtToken)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

        res.status(200).json({
            error: false,
            result: {
                username,
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

router.post("/signup", async (req, res) => {
    try {
        if (!req.body.username) throw new Error("Username is missing");
        const username = req.body.username;

        if (!req.body.password) throw new Error("Password is missing");
        const password = req.body.password;

        let data = await UserModel.find({ username });
        if (data.length > 0) throw new Error("Username is not available");

        const hashPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALTROUNDS));
        let query = { username, password: hashPassword };

        const user = new UserModel(query);
        user.save((err, data) => {
            if (err) throw new Error("Signup failed");

            res.status(200).json({
                error: false,
                result: data,
            });
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

module.exports = router;
