// External Modules
const express = require("express");

// Internal Modules

// Router
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        error: false,
        message: "random api is working",
    });
});

router.get("/integer/:totalNumber", (req, res) => {
    try {
        if (Number.isInteger(Number(req.params.totalNumber)) === false)
            throw new Error("Integer value is expected");

        const result = [];
        for (let i = 0; i < req.params.totalNumber && i < 1000; i++) {
            let randomNumber = Math.floor(Math.random() * 1000);
            result.push(randomNumber);
        }

        res.status(200).json({
            error: false,
            result: result,
        });
    } catch (error) {
        res.status(200).json({
            error: true,
            message: error.message,
        });
    }
});

router.get("/integer", (req, res) => {
    try {
        if (req.query.num && Number.isInteger(Number(req.query.num)) === false)
            throw new Error(
                "Integer value is expected for num parameter. Default num is 100."
            );

        if (req.query.min && Number.isInteger(Number(req.query.min)) === false)
            throw new Error(
                "Integer value is expected for min parameter. Default num is 0."
            );

        if (req.query.max && Number.isInteger(Number(req.query.max)) === false)
            throw new Error(
                "Integer value is expected for max parameter. Default num is 100."
            );

        if (
            req.query.base &&
            Number.isInteger(Number(req.query.base)) === false
        )
            throw new Error(
                "Integer value is expected for base parameter. Default base is 10."
            );

        let base = req.query.base || 10;
        // if (base != 8 || base != 10 || base != 16)
        //     throw new Error(
        //         "Integer value 8, 10, 16 is expected for base parameter. Default base is 10."
        //     );

        let num = req.query.num || 100;
        if (num > 1000) num = 1000;
        if (num < 1) num = 1;

        let min = req.query.min || 0;
        if (min < Number.MIN_SAFE_INTEGER) min = Number.MIN_SAFE_INTEGER;
        if (min >= Number.MAX_SAFE_INTEGER) min = Number.MAX_SAFE_INTEGER;

        let max = req.query.max || 100;
        if (max > Number.MAX_SAFE_INTEGER) max = Number.MAX_SAFE_INTEGER;
        if (max < Number.MIN_SAFE_INTEGER) max = Number.MIN_SAFE_INTEGER;

        if (min > max) {
            if (req.query.min === false)
                min = max - num * 10 < max - 100 ? max - num * 10 : max - 100;
            else if (req.query.max === false)
                max = min + num * 10 > min + 100 ? min + num * 10 : min + 100;
            else throw new Error("Max value should be less than min value.");
        }

        const result = [];
        for (let i = 0; i < num; i++) {
            min = Math.ceil(min);
            max = Math.floor(max);
            let randomNumber = Math.floor(
                Math.random() * (max - min + 1) + min
            );

            result.push(randomNumber.toString(base));
        }

        res.status(200).json({
            error: false,
            result: result,
        });
    } catch (error) {
        res.status(200).json({
            error: true,
            message: error.message,
        });
    }
});

router.get("/string", (req, res) => {});

module.exports = router;
