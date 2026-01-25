const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const adminRoutes = require("./routes/admin.route"); 

const app = express();

//  ENABLE CORS FIRST
app.use(cors());

app.use(express.json());
//  Auth routes
app.use("/auth", authRoutes);

//  User routes
app.use("/user", userRoutes);

//  Admin routes
app.use("/admin", adminRoutes);

module.exports = app;