const mongoose = require("mongoose");

const UrlSchema = mongoose.Schema(
    {
        index: { type: String, required: true },
        link: { type: String, required: true },
        alias: { type: String, required: true, unique: true },
        author: { type: String, require: true, default: "guest" },
    },
    { timestamps: true },
);

const UrlModel = mongoose.model("url", UrlSchema);
module.exports = UrlModel;
