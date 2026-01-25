const express = require("express");
const cors = require("cors");


const userRoutes = require("./routes/user.route");


const app = express();

//  ENABLE CORS FIRST
app.use(cors());

app.use(express.json());

//  User routes
app.use("/user", userRoutes);


module.exports = app;