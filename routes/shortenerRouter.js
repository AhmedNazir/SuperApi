// External Modules
const express = require("express");
const crypto = require("crypto");
require("dotenv").config();

// Internal Modules
const UrlModel = require("../models/UrlModel");
const loginProtected = require("../middlewares/loginProtected");
const { stringGenerator } = require("../utils/common");

// Router
const router = express.Router();

// forum view
router.get("/", (req, res, next) => {
    res.status(200).json({
        error: false,
        message: "shortener api is working",
    });
});

// get all url
router.get("/all", loginProtected, async (req, res, next) => {
    try {
        const author = res.locals.username;
        const result = await UrlModel.find({ author }).limit(100);

        res.status(200).json({
            error: false,
            result,
        });
    } catch (error) {
        next(error);
    }
});

// add url by get
router.get("/add", async (req, res, next) => {
    try {
        if (!req.query.link) throw new Error("Long link is missing");
        const link = req.query.link;

        const index = crypto.createHash("sha256").update(link).digest("base64");
        const author = res.locals.username || "guest";

        let alias;
        let arr;
        let data;
        if (req.query.alias) {
            arr = await UrlModel.find({ alias: req.query.alias });

            if (arr.length > 0) throw new Error("alias is not available");
            else alias = req.query.alias;
        } else {
            arr = await UrlModel.findOne({ index });

            if (author == "guest" && arr) {
                if (arr) data = arr;
            } else
                do {
                    alias = stringGenerator(process.env.ALIAS_LENGTH);
                    arr = UrlModel.find({ alias });
                } while (arr.length > 0);
        }

        if (data == null) {
            newUrl = new UrlModel({
                link,
                alias,
                index,
                author,
            });

            await newUrl.save();
        } else newUrl = data;

        res.status(200).json({
            error: false,
            result: newUrl,
        });
    } catch (error) {
        next(error);
    }
});

// get url by id
router.get("/:alias", async (req, res, next) => {
    try {
        if (!req.params.alias) throw new Error("alias is required for info");
        const alias = req.params.alias;

        const result = await UrlModel.findOne({ alias });
        if (!result) throw new Error("invalid alias");

        res.status(200).json({
            error: false,
            result: { link: result.link, alias: result.alias, author: result.author },
        });
    } catch (error) {
        next(error);
    }
});

// add url
router.post("/", async (req, res, next) => {
    try {
        if (!req.body.link) throw new Error("Long link is missing");
        const link = req.body.link;

        const index = crypto.createHash("sha256").update(link).digest("base64");
        const author = res.locals.username || "guest";

        let alias;
        let arr;
        let data;
        if (req.body.alias) {
            arr = await UrlModel.find({ alias: req.body.alias });

            if (arr.length > 0) throw new Error("alias is not available");
            else alias = req.body.alias;
        } else {
            arr = await UrlModel.findOne({ index });

            if (author == "guest" && arr) {
                if (arr) data = arr;
            } else
                do {
                    alias = stringGenerator(process.env.ALIAS_LENGTH);
                    arr = UrlModel.find({ alias });
                } while (arr.length > 0);
        }

        if (data == null) {
            newUrl = new UrlModel({
                link,
                alias,
                index,
                author,
            });

            await newUrl.save();
        } else newUrl = data;

        res.status(200).json({
            error: false,
            result: newUrl,
        });
    } catch (error) {
        next(error);
    }
});

// update url
router.put("/", async (req, res, next) => {
    try {
        if (!req.body.link) throw new Error("Long link is missing");
        const link = req.body.link;
        const index = crypto.createHash("sha256").update(link).digest("base64");
        const author = res.locals.username || "guest";

        if (!req.body.alias) throw new Error("alias is missing");
        const alias = req.body.alias;
        const data = await UrlModel.findOne({ alias: req.body.alias });
        if (!data) throw new Error("alias is invalid");

        let query;
        if (author === "guest") {
            if (!req.body.id) throw new Error("id is missing");
            query = { _id: req.body.id };
        } else {
            query = { alias };
        }

        const result = await UrlModel.findOneAndUpdate(
            query,
            {
                $set: { index, link },
            },
            {
                new: true,
            },
        );

        res.status(200).json({
            error: false,
            result,
        });
    } catch (error) {
        next(error);
    }
});

// delete url
router.delete("/:id", async (req, res, next) => {
    try {
        const author = res.locals.username || "guest";

        if (!req.params.id) throw new Error("id is required for deletion");

        const data1 = await UrlModel.findById({ _id: req.params.id });
        if (data1 == null) throw new Error("invalid id");
        else
            UrlModel.findByIdAndDelete({ _id: req.params.id }, (err) => {
                if (err) throw new Error("deletion failed");

                res.status(200).json({
                    error: false,
                    message: "deleted successfully",
                });
            });

        // let data1, data2;
        // if (!author === "guest") {
        //     if (!req.params.id) throw new Error("id is required for deletion");
        //     const id = new mongoose.Types.ObjectId(req.params.id);
        //     if (id != req.params.id) throw new Error("invalid id");

        //     let data1 = await UrlModel.findOneAndDelete({ _id: id });
        //     if (data1 == null) throw new Error("invalid id");
        // } else {
        //     if (!req.params.id) throw new Error("id or alias is required for deletion");

        //     const id = new mongoose.Types.ObjectId(req.params.id);
        //     if (id == req.params.id) {
        //         let data1 = await UrlModel.findOneAndDelete({ _id: id });
        //         if (data1 == null) throw new Error("invalid alias or id");
        //     } else {
        //         let data1 = await UrlModel.findOneAndDelete({ alias: id });
        //         if (data1 == null) throw new Error("invalid alias or id");
        //     }
        // }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
