"use strict";
const express = require("express");
let router = express.Router();
const bcrypt = require("bcrypt");
const connection = require("../models/index");

router.get("/", async (req, res) => {
  const [users, userFields] = await connection.execute("SELECT * FROM user");
  res.json(users);
});

router.put("/username/:id", async (req, res, next) => {
  const userid = req.params.id;
  const { username } = req.body;
  if (userid && username) {
    const [result, fields] = await connection.execute(
      "UPDATE user SET username=? WHERE userid=?",
      [username, userid]
    );

    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: "Updated username successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "No rows were updated",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Incomplete arguments, expected 2 (username, userid)",
    });
  }
});

router.put("/password/:id", async (req, res, next) => {
  const userid = req.params.id;
  const { password } = req.body;
  if (userid && password) {
    const [result, fields] = await connection.execute(
      "UPDATE user SET password=? WHERE userid=?",
      [password, userid]
    );

    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: "Updated password successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "No rows were updated",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Incomplete arguments, expected 2 (password, userid)",
    });
  }
});

router.post("/search", async (req, res) => {
  const { query } = req.body;
  if (query) {
    const [users, userFields] = await connection.execute(
      `SELECT * FROM user WHERE username LIKE '%${query}%'`
    );
    res.json(users);
  } else {
    res.status(400).json({
      success: false,
      message: "Incomplete arguments, expected 1 (query)",
    });
  }
});

router.put("/:id", async (req, res, next) => {
  const userid = req.params.id;
  const { username, password } = req.body;
  if (userid && username && password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result, fields] = await connection.execute(
      "UPDATE user SET username=?, password=? WHERE userid=?",
      [username, hashedPassword, userid]
    );
    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: "Updated user successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "No rows were updated",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Incomplete arguments, expected 3 (username, password, userid)",
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  const userid = req.params.id;
  if (userid) {
    const [result, fields] = await connection.execute(
      "DELETE FROM user WHERE userid=?",
      [userid]
    );
    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: "Deleted user successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "No rows were updated",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Incomplete arguments, expected 1 (userid)",
    });
  }
});

module.exports = router;
