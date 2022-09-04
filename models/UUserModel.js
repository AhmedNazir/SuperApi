const mongoose = require("mongoose");

const UUserSchema = mongoose.Schema(
    {
        alias: { type: String, required: true, unique: true },
        passcode: { type: String, require: true },
    },
    { timestamps: true },
);

const UUserModel = mongoose.model("uuser", UUserSchema);
module.exports = UUserModel;
