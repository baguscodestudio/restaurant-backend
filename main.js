import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import connection from "./models/index";
import { ACCESS_TOKEN_SECRET, PORT } from "./config";

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    connection
      .execute("INSERT INTO user (username, password) VALUES(?,?)", [
        username,
        hashedPassword,
      ])
      .then((result) => {
        res.json(result);
      });
  }
});

app.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM user WHERE username=? LIMIT 1",
      [username]
    );
    if (rows.length > 0) {
      const user = rows[0];
      const [profiles, fields] = await connection.execute(
        "SELECT * FROM profile WHERE userid=? LIMIT 1",
        [user.userid]
      );
      const isPasswordEqual = await bcrypt.compare(password, user.password);
      user.role = profiles[0].role;
      if (isPasswordEqual) {
        const token = jwt.sign({ user: user }, ACCESS_TOKEN_SECRET, {
          expiresIn: "1d",
        });
        res.json({
          message: "Successfully authenticated",
          success: true,
          data: {
            token: token,
            user: user,
          },
        });
      } else {
        res.json({ message: "Invalid password", success: false });
      }
    } else {
      res.json({ message: "No such user", success: false });
    }
  } catch (e) {
    console.log(e);
    res.json({ message: "An error occured", success: false });
  }
});

app.post(
  "/token",
  (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decodedFromToken) => {
      if (err) {
        res.json({
          tokenVerificationData: {
            access: false,
            message: "Failed to verify token",
          },
        });
        return;
      } else {
        const decoded = decodedFromToken;
        const decodedUser = decoded.user;
        console.log(decoded);

        req.verifiedUser = decodedUser;
        next();
      }
    });
  },
  (req, res) => {
    if (req.verifiedUser) {
      res.json({
        tokenVerificationData: { access: true, user: req.verifiedUser },
      });
    }
  }
);

app.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );
    if (rows.length == 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [results, fields] = await connection.query(
        "INSERT INTO user (username, password) VALUES (?, ?)",
        [username, hashedPassword]
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
});

app.get("/getRole/:id", async (req, res, next) => {
  const [profiles, profileFields] = await connection.execute(
    "SELECT role FROM profile WHERE userid=?",
    [req.params.id]
  );
  const [users, userFields] = await connnection.execute(
    "SELECT userid,username FROM user WHERE userid=?",
    [req.params.id]
  );

  if (users.length > 0) {
    if (profiles.length > 0) {
      res.json({
        success: true,
        username: users[0].username,
        role: profiles[0].role,
      });
    } else {
      res.json({
        success: true,
        username: users[0].username,
        role: "Not Assigned",
      });
    }
  } else {
    res.json({
      success: false,
      message: "User not found",
    });
  }
});

app.get("/getRoles", async (req, res) => {
  const [profiles, profileFields] = await connection.execute(
    "SELECT * FROM profile"
  );
  const [users, userFields] = await connection.execute(
    "SELECT userid, username FROM user"
  );
  let list = {};
  profiles.map((profile) => {
    list[profile.userid] = profile.role;
  });
  users.map((user) => {
    user.role = list[user.userid];
  });

  res.json({
    users,
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
