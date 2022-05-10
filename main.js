const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//db
const connection = require("./models/index");

//config
const { ACCESS_TOKEN_SECRET, PORT } = require("./config");

//routes
const cart = require("./routes/cart");
const order = require("./routes/order");
const menuitem = require("./routes/menuitem");
const role = require("./routes/role");
const useraccount = require("./routes/useraccount");

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
        res.status(400).json({ message: "Invalid password", success: false });
      }
    } else {
      res.status(400).json({ message: "No such user", success: false });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "An error occured", success: false });
  }
});

app.post(
  "/token",
  (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
      res.status(401).json({
        tokenVerificationData: {
          access: false,
          message: "Token not provided",
        },
      });
      return;
    }
    const token = header.split(" ")[1];
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decodedFromToken) => {
      if (err) {
        res.status(500).json({
          tokenVerificationData: {
            access: false,
            message: "Failed to verify token",
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

app.use("/order", order);

app.use("/cart", cart);

app.use("/useraccounts", useraccount);

app.use("/roles", role);

app.use("/items", menuitem);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
