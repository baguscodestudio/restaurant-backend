import * as dotenv from "dotenv";

dotenv.config();

export const PORT = parseInt(process.env.PORT);
export const DATABASE_URL = process.env.DATABASE_URL;
export const DATABASE_USER = process.env.DATABASE_USER;
export const DATABASE_DATABASE = process.env.DATABASE_DATABASE;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
