const mongoose = require("mongoose");
require("dotenv").config();
const mongodbURI = process.env.mongoDbUri;

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(mongodbURI);
    console.log(`Connection success ${connect.connection.name}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
