// External Modules
const express = require("express");
const geoip = require('geoip-lite');

// Router
const router = express.Router();


app.get('/', function(req, res){

    try {
        const geo = geoip.lookup(req.ip);
        
        res.status(200).json({
            error: false,
            data: {
                Headers: JSON.stringify(req.headers),
                IP: JSON.stringify(req.ip),
                Browser: req.headers["user-agent"],
                Language: req.headers["accept-language"],
                Country: (geo ? geo.country: "Unknown"),
                Region: (geo ? geo.region: "Unknown"),
            },
        });

    } catch (error) {
        res.status(500).json({
            error: true,
        });
    }

});

module.exports = router;