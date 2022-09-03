// External Modules
const express = require("express");

// Internal Modules

// Router
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        error: false,
        message: "shortener api is working",
    });
});

module.exports = router;
