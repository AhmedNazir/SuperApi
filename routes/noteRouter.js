// External Modules
const express = require("express");
const path = require("path");
require("dotenv").config();

// Internal Modules
const NoteModel = require("../models/NoteModel");
const loginProtected = require("../middlewares/loginProtected");
const checkLogin = require("../middlewares/checkLogin");
const { stringGenerator } = require("../utils/common");

// Router
const router = express.Router();

// forum view
router.get("/", (req, res) => {
    res.status(200).json({
        error: false,
        message: "Note api is working",
    });
});

// get all note >> done
router.get("/all", loginProtected, async (req, res) => {
    try {
        const author = res.locals.username;
        const result = await NoteModel.find({ author }).limit(100);

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

// add note by get >> done
router.get("/add", checkLogin, async (req, res) => {
    try {
        if (!req.query.text) throw new Error("Text is missing");
        const text = req.query.text;

        const title = req.query.title || "Untitle";
        const author = res.locals.username || "guest";

        let alias;
        do {
            alias = stringGenerator(process.env.ALIAS_LENGTH);
            arr = await NoteModel.find({ alias });
        } while (arr.length > 0);

        const note = new NoteModel({
            title,
            text,
            alias,
            author,
        });

        await note.save();

        const share = path.posix.join(req.originalUrl, alias);

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

// get url by alias >> done
router.get("/:alias", async (req, res) => {
    try {
        if (!req.params.alias) throw new Error("alias is required");
        const alias = req.params.alias;

        const note = await NoteModel.findOne({ alias }).select({ __v: 0, _id: 0 });
        if (!note) throw new Error("invalid alias");

        res.status(200).json({
            error: false,
            result: note,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

// add url >> done
router.post("/", checkLogin, async (req, res) => {
    try {
        if (!req.body.text) throw new Error("Text is missing");
        const text = req.body.text;

        const title = req.body.title || "Untitle";
        const author = res.locals.username || "guest";

        let alias;
        do {
            alias = stringGenerator(process.env.ALIAS_LENGTH);
            arr = await NoteModel.find({ alias });
        } while (arr.length > 0);

        const note = new NoteModel({
            title,
            text,
            alias,
            author,
        });

        await note.save();

        const share = path.posix.join(req.originalUrl, alias);

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

// update url >> done only id
router.put("/", checkLogin, async (req, res) => {
    try {
        const author = res.locals.author || "guest";
        const query = {};
        let id;
        if (!req.body.id) throw new Error("id is missing");
        if (req.body.id) id = req.body.id;

        if (req.body.title) query.title = req.body.title;
        if (req.body.text) query.text = req.body.text;

        const data = await NoteModel.findOne({ _id: id });
        if (!data) throw new Error("id is invalid");

        const result = await NoteModel.findOneAndUpdate({ _id: id }, { $set: query }, { new: true });

        if (!result) throw new Error("Update fails");

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

// delete url >> done only id
router.delete("/:id", checkLogin, async (req, res) => {
    try {
        const author = res.locals.author;
        if (author == "guest") {
            if (!req.params.id) throw new Error("id is required for deletion");

            let data = await NoteModel.findById({ _id: req.params.id });
            if (!data) throw new Error("invalid id");

            NoteModel.findByIdAndDelete({ _id: req.params.id }, (err) => {
                if (err) throw new Error("deletion failed");

                res.status(200).json({
                    error: false,
                    result: data,
                });
            });
        } else {
            if (!req.params.id) throw new Error("id or alias is required for deletion");
            const key = req.params.id;

            let data1 = await NoteModel.findOne({ _id: key });
            let data2 = await NoteModel.findOne({ alias: key });
            let result;

            if (data1 == null && data2 == null) throw new Error("invaild id or alias");

            if (data1) {
                query = { _id: key };
                result = data1;
            } else {
                query = { alias: key };
                result = data2;
            }
            NoteModel.findOneAndDelete(query, (err) => {
                if (err) throw new Error("deletion failed");

                res.status(200).json({
                    error: false,
                    result,
                });
            });
        }
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

module.exports = router;
