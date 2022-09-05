const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
    {
        message: { type: String, required: true },
        alias: { type: String, required: true },
    },
    { timestamps: true },
);

const MessageModel = mongoose.model("umessage", messageSchema);
module.exports = MessageModel;
