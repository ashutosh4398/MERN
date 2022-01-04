require('dotenv').config()
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const app = express();

// MIDDLEWARE STARTS

app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

// MIDDLEWARE ENDS

// ROUTES
app.use("/api", authRoutes);
app.use("/api", userRoutes)

// DB CONNECTION
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true })
    .then((resp) => {
        console.log("DB CONNECTED");
    })
    .catch(err => {
        console.log("ERROR")
    })


const port= process.env.PORT || 8000;

app.listen(port, () => {
    console.log("Connected Successfully!!!");
})