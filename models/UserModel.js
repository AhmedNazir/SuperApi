const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
    {
        firstname: { type: String },
        lastname: { type: String },
        username: { type: String, required: true, unique: true },
        password: { type: String, require: true },
    },
    { timestamps: true },
);

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
