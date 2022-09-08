// External Modules
const { query } = require("express");
const express = require("express");
const bcrypt = require("bcrypt");
const { v4: uuidv4, validate: uuidValidate } = require("uuid");
const axios = require("axios").default;
require("dotenv").config();

// Internal Modules
const CityModel = require("../models/CityModel");
const WeatherUserModel = require("../models/WeatherUserModel");
const WeatherModel = require("../models/WeatherModel");

// Router
const router = express.Router();

// view >> done
router.get("/", (req, res) => {
    res.status(200).json({
        error: false,
        message: "weather api is working. get city list by /citylist",
    });
});

// create apikey >> done
router.get("/key", async (req, res) => {
    try {
        if (!req.query.username) throw new Error("Username is missing");
        const username = req.query.username;

        if (!req.query.password) throw new Error("Password is missing");
        const password = req.query.password;

        let data = await WeatherUserModel.findOne({ username });
        if (!data) throw new Error("Username is invalid");

        const isValidPassword = await bcrypt.compare(password, data.password);
        if (!isValidPassword) throw new Error("Wrong Password");

        res.status(200).json({
            error: false,
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

// create apikey >> done
router.get("/key/create", async (req, res) => {
    try {
        if (!req.query.username) throw new Error("Username is needed");
        const username = req.query.username;

        if (!req.query.password) throw new Error("password is needed");
        const password = req.query.password;

        let data = await WeatherUserModel.find({ username });
        if (data.length > 0) throw new Error("Username is already used");

        const hashPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALTROUNDS));

        let key;
        do {
            key = uuidv4();
            data = await WeatherUserModel.find({ apikey: key });
        } while (data.length > 0);

        const user = new WeatherUserModel({
            username,
            password: hashPassword,
            apikey: key,
        });

        await user.save();

        res.status(200).json({
            error: false,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

// delete apikey >> done
router.get("/key/delete", async (req, res) => {
    try {
        if (!req.query.username) throw new Error("Username is missing");
        const username = req.query.username;

        if (!req.query.password) throw new Error("Password is missing");
        const password = req.query.password;

        let data = await WeatherUserModel.findOne({ username });
        if (!data) throw new Error("Username is invalid");

        const isValidPassword = await bcrypt.compare(password, data.password);
        if (!isValidPassword) throw new Error("Wrong Password");

        await WeatherUserModel.findOneAndDelete({ username });
        res.status(200).json({
            error: false,
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

// accurate location need apikey >> done limit 100
router.get("/location", async (req, res) => {
    try {
        if (!req.query.apikey) throw new Error("apikey is needed");
        const apikey = req.query.apikey;

        if (!req.query.lat) throw new Error("lattitude is needed");
        const lattitude = req.query.lat;

        if (!req.query.lon) throw new Error("longitude is needed");
        const longitude = req.query.lon;

        const isValid = await WeatherUserModel.findOne({ apikey });
        if (!isValid) throw new Error("apikey is invalid");
        const count = isValid.count;
        if (count > Number(process.env.WEATHER_API_LIMIT)) throw new Error("apikey limit excess");

        await WeatherUserModel.findOneAndUpdate(
            { apikey },
            {
                $set: {
                    count: count + 1,
                },
            },
        );

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lattitude}&lon=${longitude}&appid=5aa137464eb3b9c0558f1b5469f045cf`;

        let result = await axios.get(url);
        if (!result.data) throw new Error("Weather data collection is failed");
        result = result.data;
        console.log(url);

        res.status(200).json({
            error: false,
            query: { apikey, lattitude, longitude },
            weather: result,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

//get city list by country, city, id >> done
router.get("/citylist", async (req, res) => {
    try {
        let query = {};
        if (req.query.country) query.country = req.query.country;
        if (req.query.city) query.city = req.query.city;
        if (req.query.id) query.id = Number(req.query.id);

        console.log(query);
        const data = await CityModel.find(query).select({ _id: 0, __v: 0 });

        res.status(200).json({
            error: false,
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

//get city weather >> done
router.get("/:city", async (req, res) => {
    try {
        if (!req.params.city) throw new Error("City is needed");
        let city = req.params.city;

        city = await CityModel.findOne({ city });
        if (!city) throw new Error("This City is not available");

        const lattitude = city.lattitude;
        const longitude = city.longitude;

        let hourly = await WeatherModel.findOne({
            cityid: city.id,
            updatedAt: { $gte: new Date(Date.now() - 1000 * 60 * 60) },
        });

        if (!hourly) {
            await WeatherModel.deleteMany({ cityid: city.id });

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lattitude}&lon=${longitude}&appid=5aa137464eb3b9c0558f1b5469f045cf`;
            let result = await axios.get(url);

            if (!result.data) throw new Error("Weather data collection is failed");
            result = result.data;
            console.log(url);

            const newUpdate = new WeatherModel({
                temp: result.main.temp,
                temp_min: result.main.temp_min,
                temp_max: result.main.temp_max,
                temp_feel: result.main.feels_like,
                pressure: result.main.pressure,
                humidity: result.main.humidity,
                sea_level: result.main.sea_level,
                visibility: result.main.visibility,
                wind: result.wind.speed,
                description: result.weather[0].description,
                cityid: city.id,
            });

            await newUpdate.save();
            hourly = newUpdate;
        }

        res.status(200).json({
            error: false,
            city: city,
            weather: hourly,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

//get historical data of city >> done
router.get("/forecast/:city", async (req, res) => {
    try {
        if (!req.params.city) throw new Error("City is needed");
        let city = req.params.city;

        city = await CityModel.findOne({ city });
        if (!city) throw new Error("This City is not available");

        const lattitude = city.lattitude;
        const longitude = city.longitude;

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lattitude}&longitude=${longitude}&hourly=temperature_2m`;

        let result = await axios.get(url);

        if (!result.data) throw new Error("Weather data collection is failed");

        result = result.data;
        console.log(url);

        res.status(200).json({
            error: false,
            city,
            forecast: result,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

module.exports = router;
