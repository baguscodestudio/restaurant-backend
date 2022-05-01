import { DATABASE_URL, DATABASE_DATABASE, DATABASE_USER } from "../config";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: DATABASE_URL,
  user: DATABASE_USER,
  database: DATABASE_DATABASE,
});

export default connection;
