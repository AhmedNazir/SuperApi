// External Modules
const express = require("express");
var geoip = require('geoip-lite');

// Router
const router = express.Router();


app.get('/test', function(req, res){

    console.log('Headers: ' + JSON.stringify(req.headers));
    console.log('IP: ' + JSON.stringify(req.ip));

    var geo = geoip.lookup(req.ip);

    console.log("Browser: " + req.headers["user-agent"]);
    console.log("Language: " + req.headers["accept-language"]);
    console.log("Country: " + (geo ? geo.country: "Unknown"));
    console.log("Region: " + (geo ? geo.region: "Unknown"));

    console.log(geo);

    res.status(200);
    res.header("Content-Type",'application/json');
    res.end(JSON.stringify({status: "OK"}));
});

module.exports = router;