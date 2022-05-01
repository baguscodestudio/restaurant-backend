import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connection from "../models/index";
import { ACCESS_TOKEN_SECRET } from "../config";

export default class UserService {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  async isAuthenticated(token) {
    if (token) {
      jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return {
            message: "Failed to authenticate",
            success: false,
          };
        } else {
          return {
            message: "Authenticated",
            success: true,
            data: decoded,
          };
        }
      });
    } else {
      return {
        message: "No Token",
        success: false,
      };
    }
  }

  async login() {
    try {
      const [rows, fields] = await connection.execute(
        "SELECT * FROM user WHERE username=? LIMIT 1",
        [this.username]
      );
      if (rows.length > 0) {
        const user = rows[0];
        console.log("password: " + this.password);
        const isPasswordEqual = await bcrypt.compare(
          this.password,
          user.password
        );
        console.log("password from db: " + user.password);
        if (isPasswordEqual) {
          const token = jwt.sign({ user: user }, ACCESS_TOKEN_SECRET, {
            expiresIn: "1d",
          });
          return {
            message: "Successfully authenticated",
            success: true,
            data: {
              token: token,
              user: user,
            },
          };
        } else {
          return { message: "Invalid password", success: false };
        }
      } else {
        return { message: "No such user", success: false };
      }
    } catch (e) {
      console.log(e);
      return { message: "An error occured", success: false };
    }
  }

  async register() {
    try {
      const [rows, fields] = await connection.execute(
        "SELECT * FROM user WHERE username = ?",
        [this.username]
      );
      if (rows.length == 0) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        const [results, fields] = await connection.query(
          "INSERT INTO user (username, password) VALUES (?, ?)",
          [this.username, hashedPassword]
        );
        console.log(results, fields);
        if (results.affectedRows > 0) {
          return {
            message: "Successfully registered",
            success: true,
            data: results,
          };
        } else {
          return {
            message: "An error occured while saving user",
            success: false,
          };
        }
      } else {
        return { message: "User already exists", success: false };
      }
    } catch (e) {
      console.log(e);
      return { message: "An error occured", success: false };
    }
  }
}
