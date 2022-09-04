// External Modules
const express = require("express");
const path = require("path");
require("dotenv").config();

// Internal Modules
const UMessageModel = require("../models/UMessageModel");
const UUserModel = require("../models/UUserModel");
// const loginProtected = require("../middlewares/loginProtected");
// const checkLogin = require("../middlewares/checkLogin");
const { stringGenerator } = require("../utils/common");

// Router
const router = express.Router();

// forum view
router.get("/", (req, res) => {
    res.status(200).json({
        error: false,
        message: "Unknown Message Service api is working",
    });
});

// create new alias >> done
router.post("/create", async (req, res) => {
    try {
        let alias = req.body.alias;
        const passcode = req.body.passcode || stringGenerator(process.env.ALIAS_LENGTH);

        if (alias) {
            let arr = await UUserModel.find({ alias });
            if (arr.length > 0) throw new Error("alias is not avilable");
        } else {
            let arr;
            do {
                alias = stringGenerator(process.env.ALIAS_LENGTH);
                arr = await UUserModel.find({ alias });
            } while (arr.length > 0);
        }

        const note = new UUserModel({
            alias,
            passcode,
        });

        await note.save();

        const share = "/umessage/message/" + alias;

        res.status(200).json({
            error: false,
            share,
            result: note,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

// create new alias >> done
router.get("/create", async (req, res) => {
    try {
        let alias = req.query.alias;
        const passcode = req.query.passcode || stringGenerator(process.env.ALIAS_LENGTH);

        if (alias) {
            let arr = await UUserModel.find({ alias });
            if (arr.length > 0) throw new Error("alias is not avilable");
        } else {
            let arr;
            do {
                alias = stringGenerator(process.env.ALIAS_LENGTH);
                arr = await UUserModel.find({ alias });
            } while (arr.length > 0);
        }

        const note = new UUserModel({
            alias,
            passcode,
        });

        await note.save();

        const share = "/umessage/message/" + alias;

        res.status(200).json({
            error: false,
            share,
            result: note,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

// get all message >> done
router.post("/inbox", async (req, res) => {
    try {
        if (!req.body.alias) throw new Error("alias is required for inbox");
        const alias = req.body.alias;

        if (!req.body.passcode) throw new Error("passcode is required for inbox");
        const passcode = req.body.passcode;

        let data = await UUserModel.findOne({ alias, passcode });
        if (!data) throw new Error("invalid alias or passcode");

        const result = await UMessageModel.find({ alias });

        res.status(200).json({
            error: false,
            alias,
            result,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

// message at alias by get >> done
router.get("/:alias", async (req, res) => {
    try {
        if (!req.params.alias) throw new Error("alias is required");
        const alias = req.params.alias;

        if (!req.query.message) throw new Error("message is required");
        const message = req.query.message;

        const user = await UUserModel.findOne({ alias });
        if (!user) throw new Error("invalid alias");

        const newMessage = new UMessageModel({
            alias,
            message,
        });

        const result = await newMessage.save();
        if (!result) throw new Error("Message saving failed");

        res.status(200).json({
            error: false,
            result,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

// message at alias >> done
router.post("/:alias", async (req, res) => {
    try {
        if (!req.params.alias) throw new Error("alias is required");
        const alias = req.params.alias;

        if (!req.body.message) throw new Error("message is required");
        const message = req.body.message;

        const user = await UUserModel.findOne({ alias });
        if (!user) throw new Error("invalid alias");

        const newMessage = new UMessageModel({
            alias,
            message,
        });

        console.log(newMessage);
        
        const flag = await newMessage.save();


        if (!flag) throw new Error("Message saving failed");

        res.status(200).json({
            error: false,
            result: newMessage,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

// delete alias and all message >> done
router.delete("/", async (req, res) => {
    try {
        if (!req.body.alias) throw new Error("alias is required for deletion");
        const alias = req.body.alias;

        if (!req.body.passcode) throw new Error("passcode is required for deletion");
        const passcode = req.body.passcode;

        let data = await UUserModel.findOne({ alias, passcode });
        if (!data) throw new Error("invalid alias or passcode");

        UUserModel.findOneAndDelete({ alias, passcode }, (err) => {
            if (err) throw new Error("deletion failed");

            UMessageModel.deleteMany({ alias }, (err) => {
                if (err) throw new Error("deletion failed");

                res.status(200).json({
                    error: false,
                    result: data,
                });
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
