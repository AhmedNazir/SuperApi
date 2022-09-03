// External Modules
const express = require("express");

// Internal Modules
const words = require("../utils/word1000");

// Router
const router = express.Router();

function stringGenerator(length, loweralpha, upperalpha, digits, special) {
    var result = "";

    var characters = "";
    if (digits) characters += "0123456789";
    if (upperalpha) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (loweralpha) characters += "abcdefghijklmnopqrstuvwxyz";
    if (special) characters += "!@#$%^&";

    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

router.get("/", (req, res) => {
    res.status(200).json({
        error: false,
        message: "random api is working",
    });
});

router.get("/integer/:count", (req, res) => {
    try {
        if (Number.isInteger(Number(req.params.count)) === false)
            throw new Error(
                "positive Integer value is expected. Mimimum limit 1 and maximum limit 1000.",
            );

        let min = 0,
            max = 1000,
            count = Number(req.params.count);

        if (count < 1) count = 1;
        if (count > 1000) count = 1000;

        const result = [];
        for (let i = 0; i < count; i++) {
            let randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
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
        if (req.query.count && Number.isInteger(Number(req.query.count)) === false)
            throw new Error("Integer value is expected for count parameter. Default count is 100.");

        if (req.query.min && Number.isInteger(Number(req.query.min)) === false)
            throw new Error("Integer value is expected for min parameter. Default count is 0.");

        if (req.query.max && Number.isInteger(Number(req.query.max)) === false)
            throw new Error("Integer value is expected for max parameter. Default count is 100.");

        let except = [];
        if (req.query.except) {
            let arr = req.query.except.split(",");
            arr.forEach((element) => {
                if (Number(element)) except.push(Number(element));
                else {
                    throw new Error("except value should be seperated by commas. like 10,52,86,45");
                }
            });
        }

        if (req.query.base && Number.isInteger(Number(req.query.base)) === false)
            throw new Error("Integer value is expected for base parameter. Default base is 10.");

        let base = Number(req.query.base) || 10;
        if (base != 8 && base != 10 && base != 16)
            throw new Error(
                "Integer value 8, 10, 16 is expected for base parameter. Default base is 10.",
            );

        let count = Number(req.query.count) || 100;
        if (count > 1000) count = 1000;
        if (count < 1) count = 1;

        let min = Number(req.query.min) || 0;
        if (min < Number.MIN_SAFE_INTEGER) min = Number.MIN_SAFE_INTEGER;
        if (min >= Number.MAX_SAFE_INTEGER) min = Number.MAX_SAFE_INTEGER;

        let max = Number(req.query.max) || 100;
        if (max > Number.MAX_SAFE_INTEGER) max = Number.MAX_SAFE_INTEGER;
        if (max < Number.MIN_SAFE_INTEGER) max = Number.MIN_SAFE_INTEGER;

        if (req.query.min && req.query.max == null)
            max = min + count * 10 > min + 100 ? min + count * 10 : min + 100;
        if (req.query.min == null && req.query.max)
            min = max - count * 10 < max - 100 ? max - count * 10 : max - 100;

        if (min >= max) throw new Error("min value should be less than max value.");

        const result = [];
        for (let i = 0; i < count; i++) {
            min = Math.ceil(min);
            max = Math.floor(max);
            let randomNumber;
            do {
                randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
            } while (except.includes(randomNumber) === true);

            result.push(randomNumber);
        }

        res.status(200).json({
            error: false,
            parameter: { count, min, max, base, except },
            result: result,
        });
    } catch (error) {
        res.status(200).json({
            error: true,
            message: error.message,
        });
    }
});

router.get("/string", (req, res) => {
    try {
        if (req.query.count && Number.isInteger(Number(req.query.count)) === false)
            throw new Error("an integer is expected for count. Default count is 10.");

        let count = req.query.count || 10;
        count = Number(count);

        if (count > 1000) count = 100;
        if (count < 1) count = 1;

        if (req.query.length && Number.isInteger(Number(req.query.length)) === false)
            throw new Error("an integer is expected for length. Default length is 10.");

        let length = req.query.length || 10;
        length = Number(length);
        if (length > 100) length = 100;
        if (length < 1) length = 1;

        if (req.query.digits && Number.isInteger(Number(req.query.digits)) === false)
            throw new Error("an integer is expected for digits. Default digits is 1 for on.");

        let digits = req.query.digits || 1;
        digits = Number(digits);
        if (digits > 1 || digits < 0) digits = 1;

        if (req.query.upperalpha && Number.isInteger(Number(req.query.upperalpha)) === false)
            throw new Error(
                "an integer is expected for upperalpha. Default upperalpha is 1 for on.",
            );

        let upperalpha = req.query.upperalpha || 1;
        upperalpha = Number(upperalpha);
        if (upperalpha > 1 || upperalpha < 0) upperalpha = 1;

        if (req.query.loweralpha && Number.isInteger(Number(req.query.loweralpha)) === false)
            throw new Error(
                "an integer is expected for loweralpha. Default loweralpha is 1 for on.",
            );

        let loweralpha = req.query.loweralpha || 1;
        loweralpha = Number(loweralpha);
        if (loweralpha > 1 || loweralpha < 0) loweralpha = 1;

        if (req.query.special && Number.isInteger(Number(req.query.special)) === false)
            throw new Error("an integer is expected for special. Default special is 0 for off.");
        let special = req.query.special || 0;
        special = Number(special);

        if (special > 1 || special < 0) special = 1;

        const result = [];
        for (let i = 0; i < count; i++) {
            let r = stringGenerator(length, loweralpha, upperalpha, digits, special);
            result.push(r);
        }

        res.status(200).json({
            error: false,
            parameter: { count, length, loweralpha, upperalpha, digits, special },
            result,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

router.get("/dictionary/:count", (req, res) => {
    try {
        if (Number.isInteger(Number(req.params.count)) === false)
            throw new Error(
                "positive Integer value is expected. Mimimum limit 1 and maximum limit 1000.",
            );

        let count = req.params.count || 1;
        count = Number(count);

        if (count < 1) count = 1;
        if (count > 1000) count = 1000;

        let result = [];
        for (let i = 0; i < count; i++) {
            let randomNumber = Math.floor(Math.random() * 1000);
            result.push(words[randomNumber]);
        }

        res.status(200).json({
            error: false,
            parameter: { count, total: words.length },
            result,
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        });
    }
});

router.get("/dictionary", (req, res) => {
    let url = req.originalUrl;
    if (url[url.length - 1] != "/") url = url + "/";
    res.redirect(url + "1");
    
    //     try {
    //         let count = 1;

    //         let result = [];
    //         for (let i = 0; i < count; i++) {
    //             let randomNumber = Math.floor(Math.random() * 1000);
    //             result.push(words[randomNumber]);
    //         }

    //         res.status(200).json({
    //             error: false,
    //             parameter: { count, total: words.length },
    //             result,
    //         });
    //     } catch (error) {
    //         res.status(500).json({
    //             error: true,
    //             message: error.message,
    //         });
    //     }
});

router.get("/toss", (req, res) => {
    let url = req.originalUrl;
    if (url[url.length - 1] != "/") url = url + "/";
    res.redirect(url + "1");
    // try {
    //     let randomNumber = Math.floor(Math.random() * 100);
    //     const result = randomNumber % 2 ? "head" : "tail";

    //     res.status(200).json({
    //         error: false,
    //         result: result,
    //     });
    // } catch (error) {
    //     res.status(200).json({
    //         error: true,
    //         message: error.message,
    //     });
    // }
});

router.get("/toss/:count", (req, res) => {
    try {
        if (Number.isInteger(Number(req.params.count)) === false)
            throw new Error(
                "positive Integer value is expected. Mimimum limit 1 and maximum limit 1000.",
            );

        let count = req.params.count || 1;
        count = Number(count);

        if (count < 1) count = 1;
        if (count > 1000) count = 1000;

        let result = [];

        for (let i = 0; i < count; i++) {
            let randomNumber = Math.floor(Math.random() * 100);
            const r = randomNumber % 2 ? "head" : "tail";
            result.push(r);
        }

        res.status(200).json({
            error: false,
            parameter: { count },
            result,
        });
    } catch (error) {
        res.status(200).json({
            error: true,
            message: error.message,
        });
    }
});

router.get("/dice", (req, res) => {
    try {
        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * 100) % 7;
        } while (randomNumber == 0);

        res.status(200).json({
            error: false,
            parameter: { min: 1, max: 6 },
            result: randomNumber,
        });
    } catch (error) {
        res.status(200).json({
            error: true,
            message: error.message,
        });
    }
});

module.exports = router;
