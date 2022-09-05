const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const fs = require("fs");
const doenv = require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const { v4: uuidv4, validate: uuidValidate } = require("uuid");
const aws = require("aws-sdk");

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
});
const s3 = new aws.S3();

// internal
const File = require("../models/FileModel");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderName = process.env.FILE_UPLOAD_PATH;

        try {
            if (!fs.existsSync(folderName)) {
                fs.mkdirSync(folderName);
            }
        } catch (err) {
            console.error(new Error("creation of upload folder is failed."));
        }

        cb(null, folderName);
    },

    filename: function (req, file, cb) {
        let fileBaseName = path
            .basename(file.originalname, path.extname(file.originalname))
            .replace(" ", "-")
            .replace(/[^a-z0-9-]/gi, "")
            .toLowerCase();
        let fileExtName = path.extname(file.originalname);

        const uniqueName = fileBaseName + "-" + Date.now() + fileExtName;
        cb(null, uniqueName);
    },
});

const upload = multer({
    // fileFilter,
    storage: multerS3({
        acl: "public-read",
        s3,
        bucket: "cyclic-lazy-gray-hen-fez-ap-northeast-2",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: "TESTING_METADATA" });
        },
        key: function (req, file, cb) {
            let fileBaseName = path
                .basename(file.originalname, path.extname(file.originalname))
                .replace(" ", "-")
                .replace(/[^a-z0-9-]/gi, "")
                .toLowerCase();
            let fileExtName = path.extname(file.originalname);

            const uniqueName = fileBaseName + "-" + Date.now() + fileExtName;
            cb(null, uniqueName);
        },
    }),
});

router.get("/", (req, res, next) => {
    try {
        res.render("files");
        next();
    } catch (error) {
        next(error);
    }
});

router.post("/", upload.fields([{ name: "files", maxCount: 10 }]), async (req, res, next) => {
    try {
        if (!req.files) next("File(s) is missing");
        const alias = uuidv4();

        req.files.files.forEach(async (element) => {
            element.alias = alias;
            let file = new File(element);
            await file.save();
        });

        res.redirect("/file/" + alias);
        console.log({
            error: false,
            share: "/file/" + alias,
        });

        next();
    } catch (error) {
        next(error);
    }
});

router.get("/:alias", async (req, res) => {
    try {
        if (!req.params.alias) throw new Error("share url is missing");
        const alias = req.params.alias;
        if (!uuidValidate(alias)) throw new Error("share url is not valid");

        const data = await File.find({ alias });

        if (data.length == 0) throw new Error("No files for download");

        res.render("fileShare", { data });

        // res.json({
        //     error: false,
        //     result: data,
        // });
    } catch (error) {
        res.json({
            error: true,
            message: error.message,
        });
    }
});

module.exports = router;
