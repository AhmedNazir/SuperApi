const mongoose = require("mongoose");

const FileSchema = mongoose.Schema(
    {
        filename: String,
        originalname: String,
        encoding: String,
        destination: String,
        filename: String,
        size: Number,
        alias: { type: String, required: true },
        path: { type: String, required: true, unique: true },
    },
    { timestamps: true },
);

const FileModel = mongoose.model("file", FileSchema);
module.exports = FileModel;
