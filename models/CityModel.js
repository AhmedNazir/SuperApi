const mongoose = require("mongoose");

const CitySchema = mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        lattitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        altitude: { type: Number, required: true },
    },
    { collation: { locale: "en", strength: 2 } },
);

const CityModel = mongoose.model("cities", CitySchema);
module.exports = CityModel;
