const express= require("express");
const cors= require("cors");
const app= express();
require ("dotenv").config();

//middleware
app.use(express.json());
app.use(cors());
const passport = require("passport");
require("./middleware/passport");
app.use(passport.initialize());


const userRoute= require("./routes/user");
const connectDB= require("./connect_db");
connectDB();


app.use("/user", userRoute);



app.listen(process.env.Port, (err)=>err?console.log(err):console.log("server is running"));