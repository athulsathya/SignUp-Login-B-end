const express = require("express");
const app = express();

require("dotenv").config();

const authRoutes = require("./routes/authRoute");
const connectDb = require("./config/db");

const cors = require("cors");
const cookieParser = require("cookie-parser");

connectDb();

app.use(
  cors({
    origin: "https://sign-up-login-gamma.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/api", authRoutes);

module.exports = app;