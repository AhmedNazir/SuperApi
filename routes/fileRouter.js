const express = require("express");
const multer = require("multer");
const fs = require("fs");
const doenv = require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const { v4: uuidv4, validate: uuidValidate } = require("uuid");
const cloudinary = require("cloudinary").v2;

// internal
const File = require("../models/FileModel");

const router = express.Router();

cloudinary.config({
    cloud_name: "databin",
    api_key: "693894822256763",
    api_secret: "F1e4x2rBorR1aUjCYhCCURg2iFU",
});

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

let upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000, // 1MB
    },
    // fileFilter: (req, file, callback) => {
    // if (file.fieldname === "files") {
    //     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    //         callback(null, true);
    //     } else {
    //         callback(new Error("Only jpg, png file is allowed."));
    //     }
    // } else if (file.fieldname === "resume") {
    //     if (
    //         file.mimetype === "application/pdf" ||
    //         file.mimetype === "application/msword" ||
    //         file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    //     ) {
    //         callback(null, true);
    //     } else {
    //         callback(new Error("Only pdf, doc, docx file is allowed."));
    //     }
    // } else {
    //     cb(new Error("There was an unknown error!"));
    // }
    // },
});

router.get("/", (req, res, next) => {
    try {
        res.render("files");
        next();
    } catch (error) {
        next(error);
    }
});

router.post("/", upload.fields([{ name: "files", maxCount: 10 }]), async (req, res) => {
    try {
        if (!req.files) throw new Error("File(s) is missing");
        const alias = uuidv4();

        // let arr = [];
        req.files.files.forEach(async (element) => {
            const uploadfolder = "files/" + element.filename;
            const result = await cloudinary.uploader.upload(element.path, { public_id: uploadfolder });
            element.path = result.url;

            // element.path = "/uploads/" + element.filename;
            // console.log("tmp/" + element.filename);

            element.alias = alias;
            let file = new File(element);
            await file.save();
            const p = path.join(process.env.FILE_UPLOAD_PATH, element.filename);
            fs.unlinkSync(p);
        });

        // Promise.all[(arr, p1)];
        // res.json({
        //     error: false,
        //     share: "/file/" + alias,
        // });
        // await new Promise((resolve) => setTimeout(resolve, 1000));

        res.redirect("/file/" + alias);
    } catch (error) {
        res.json({
            error: true,
            message: error.message,
        });
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
