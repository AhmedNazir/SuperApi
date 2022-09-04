const mongoose = require("mongoose");

const uMessageSchema = mongoose.Schema(
    {
        message: { type: String, required: true },
        alias: { type: String, required: true },
    },
    { timestamps: true },
);

const UMessageModel = mongoose.model("umessage", uMessageSchema);
module.exports = UMessageModel;
