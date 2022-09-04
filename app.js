// External Module
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");

// Internal Modules
const indexRouter = require("./routes/indexRouter");
const randomRouter = require("./routes/randomRouter");
const weatherRouter = require("./routes/weatherRouter");
const shortenerRouter = require("./routes/shortenerRouter");
const newsRouter = require("./routes/newsRouter");
const userRouter = require("./routes/userRouter");
const noteRouter = require("./routes/noteRouter");
const uMessageRouter = require("./routes/uMessageRouter.js");

// Database Connection
mongoose
    .connect(process.env.DATABASE_CONNECTION_PATH)
    .then(() => console.log("Database connection is ok"))
    .catch((err) => console.log(err.message));

// App Module
const app = express();

// App Setting
app.use(express.json());
app.use(cors());

// Route Setting
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/random", randomRouter);
app.use("/shortener", shortenerRouter);
app.use("/weather", weatherRouter);
app.use("/news", newsRouter);
app.use("/note", noteRouter);
app.use("/message", uMessageRouter);

// Server Listen
app.listen(process.env.PORT || 3000, (err) => {
    if (err) console.log("Server setup is failed");
    else console.log(`App is listening at http://localhost:${process.env.PORT}`);
});
