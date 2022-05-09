// import * as dotenv from "dotenv";
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: parseInt(process.env.PORT),
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_DATABASE: process.env.DATABASE_DATABASE,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
};
