// External Modules
const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

// Internal Modules
const UserModel = require("../models/UserModel");

// Router
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        error: false,
        message: " api is working",
    });
});

router.post("/login", async (req, res) => {
    try {
        if (!req.body.username) throw new Error("Username is missing");
        const username = req.body.username;

        if (!req.body.password) throw new Error("Password is missing");
        const password = req.body.password;

        let data = await UserModel.findOne({ username });
        if (!data) throw new Error("Username is invalid");

        const isValidPassword = await bcrypt.compare(password, data.password);
        if (!isValidPassword) throw new Error("Wrong Password");

        const token = jwt.sign({ username }, process.env.AUTH_KEY, { expiresIn: "7d" });

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
