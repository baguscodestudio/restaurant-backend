import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config";

export default class Token {
  static verify(req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
      res.json({
        data: {
          tokenVerificationData: {
            access: false,
            message: "No token provided",
          },
        },
      });
      return;
    }
    const token = header.split(" ")[1];
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decodedFromToken) => {
      if (err) {
        res.json({
          data: {
            tokenVerificationData: {
              access: false,
              message: "Failed to verify token",
            },
          },
        });
        return;
      } else {
        const decoded = decodedFromToken;
        const decodedUser = decoded.user;

        req.verifiedUser = decodedUser;
        next();
      }
    });
  }
}
