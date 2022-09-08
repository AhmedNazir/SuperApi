const mongoose = require("mongoose");

const WeatherSchema = mongoose.Schema(
    {
        cityid: { type: Number, required: true },
        temp: { type: Number, required: true },
        temp_min: { type: String, required: true },
        temp_max: { type: String, required: true },
        temp_feel: { type: Number, required: true },
        wind: { type: Number },
        pressure: { type: Number },
        humidity: { type: Number },
        visibility: { type: Number },
        sea_level: { type: Number },
        description: { type: String },
    },
    { timestamps: true },
);

const WeatherModel = mongoose.model("weatherhourly", WeatherSchema);
module.exports = WeatherModel;
