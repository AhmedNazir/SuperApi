// External Module
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const path = require("path");

// Internal Modules
const indexRouter = require("./routes/indexRouter");
const randomRouter = require("./routes/randomRouter");
const weatherRouter = require("./routes/weatherRouter");
const shortenerRouter = require("./routes/shortenerRouter");
const newsRouter = require("./routes/newsRouter");
const userRouter = require("./routes/userRouter");
const noteRouter = require("./routes/noteRouter");
const messageRouter = require("./routes/messageRouter");
const fileRouter = require("./routes/fileRouter");

// Database Connection
mongoose
    .connect(process.env.DATABASE_CONNECTION_PATH)
    .then(() => console.log("Database connection is ok"))
    .catch((err) => console.log(err.message));

// App Module
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// App Setting
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Route Setting
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/random", randomRouter);
app.use("/shortener", shortenerRouter);
app.use("/weather", weatherRouter);
app.use("/news", newsRouter);
app.use("/note", noteRouter);
app.use("/message", messageRouter);
app.use("/file", fileRouter);

// // 404 error
// app.use((req, res, next) => {
//     next(new Error("Not Found"));
// });

// General Error
app.use((error, req, res, next) => {
    if (error) {
        const message = error.message || "Some error occurs.";
        console.log("error message: " + message);
        console.log(error);
        res.status(500).json({
            error: true,
            message,
        });
    }
});

// Server Listen
app.listen(process.env.PORT || 3000, (err) => {
    if (err) console.log("Server setup is failed");
    else console.log(`App is listening at http://localhost:${process.env.PORT}`);
});
