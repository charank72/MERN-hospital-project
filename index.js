const express=require('express')
const {StatusCodes}=require('http-status-codes')
const connectDb=require('./db/connect')
require("dotenv").config();
const cookieParser = require("cookie-parser");

const cors = require("cors");

const PORT = process.env.PORT;
const app=express()


//body parser
app.use(express.urlencoded({ extended: false })); //query format
app.use(express.json()); //json format
//public dir as static/*  */

//middleware

app.use(cors());
app.use(cookieParser(process.env.ACCESS_SECRET));

app.use(express.static("public"));
//routes
app.use("/api/user", require("./routes/userRoute"));
// app.use("/api/file", require("./routes/userRoute"));

//default path

app.use("**", (req, res) => {
  res
    .status(StatusCodes.SERVICE_UNAVAILABLE)
    .json({ msg: `Requested service 5 path not found`, success: false});
});

//Server listen
app.listen(PORT, () => {
  connectDb(); //connecting mongo
  console.log(`server is started and running at @ http://localhost:${PORT}`);
});
