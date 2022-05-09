// import { DATABASE_URL, DATABASE_DATABASE, DATABASE_USER } from "../config";
// import mysql from "mysql2/promise";
const { DATABASE_URL, DATABASE_DATABASE, DATABASE_USER } = require("../config");
const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: DATABASE_URL,
  user: DATABASE_USER,
  database: DATABASE_DATABASE,
});

module.exports = connection;
