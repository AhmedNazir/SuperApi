const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema(
    {
        title: { type: String, required: true, default: "Untitle" },
        text: { type: String, required: true },
        alias: { type: String, required: true, unique: true },
        author: { type: String, require: true, default: "guest" },
    },
    { timestamps: true },
);

const NoteModel = mongoose.model("note", NoteSchema);
module.exports = NoteModel;
