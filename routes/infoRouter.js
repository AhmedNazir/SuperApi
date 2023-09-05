// External Modules
const express = require("express");
const geoip = require('geoip-lite');
const axios = require("axios").default;

// Router
const router = express.Router();


router.get('/', async function(req, res){

    try {
        const geo = geoip.lookup(req.ip);
        const url = `https://ipinfo.io/${req.ip}?token=d1d067681e8dcb`;

        let result = await axios.get(url);
        if (!result.data) throw new Error("Weather data collection is failed");
        result = result.data;

        
        res.status(200).json({
            error: false,
            data: {
                Headers: JSON.stringify(req.headers),
                IP: req.ip,
                Browser: req.headers["user-agent"],
                Language: req.headers["accept-language"],
                Country: (geo ? geo.country: "Unknown"),
                Region: (geo ? geo.region: "Unknown"),
                ipinfo: result,
            },
        });

    } catch (error) {
        res.status(500).json({
            error: error.message || "unknown error",
        });
    }

});

router.info

module.exports = router;