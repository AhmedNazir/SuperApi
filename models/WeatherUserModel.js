const mongoose = require("mongoose");

const WeatherUserSchema = mongoose.Schema({
    apikey: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, require: true },
    count: { type: Number, require: true, default: 1 },
});

const WeatherUserModel = mongoose.model("weatherkeylist", WeatherUserSchema);
module.exports = WeatherUserModel;
