const express = require("express");
const app = express();
require("dotenv").config();
const authRoutes=require('./routes/authRoute')
const connectDb=require('./config/db')

connectDb()

const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/api",authRoutes)

app.listen(8000, () => {
  console.log("Server running on 8000");
});