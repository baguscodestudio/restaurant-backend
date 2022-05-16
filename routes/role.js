"use strict";
const express = require("express");
let router = express.Router();
const connection = require("../models/index");

// router.get('/list')

router.get("/", async (req, res) => {
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

  res.json(users);
});

router.get("/:id", async (req, res, next) => {
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
      res.status(500).json({
        success: true,
        username: users[0].username,
        role: "Not Assigned",
      });
    }
  } else {
    res.status(500).json({
      success: false,
      message: "User not found",
    });
  }
});

router.post("/search", async (req, res) => {
  const { query } = req.body;
  if (query) {
    const [result, field] = await connection.execute(
      `SELECT * FROM user LEFT OUTER JOIN profile ON user.userid = profile.userid WHERE user.username LIKE '%${query}%'`
    );
    res.status(200).json(result);
  } else {
    res.status(400).json({
      success: false,
      message: "Incomplete arguments, expected 1 (query)",
    });
  }
});

router.put("/:id", async (req, res, next) => {
  const userid = req.params.id;
  const { role } = req.body;
  if (userid && role) {
    const [profile, profileFields] = await connection.execute(
      "SELECT * FROM profile WHERE userid=?",
      [userid]
    );
    if (profile.length > 0) {
      const [result, field] = await connection.execute(
        "UPDATE profile SET role=? WHERE userid=?",
        [role, userid]
      );
      if (result.affectedRows > 0) {
        res.json({
          success: true,
          message: "Updated role successfully",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "No rows were updated",
        });
      }
    } else {
      const [result, field] = await connection.execute(
        "INSERT INTO profile VALUES (?,?)",
        [userid, role]
      );
      if (result.affectedRows > 0) {
        res.json({
          success: true,
          message: "Assigned role successfully",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "No rows were updated",
        });
      }
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Incomplete arguments, expected 2 (userid, role)",
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  const userid = req.params.id;
  if (userid) {
    const [result, field] = await connection.execute(
      "DELETE FROM profile WHERE userid=?",
      [userid]
    );
    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: "Assigned role successfully",
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
      message: "Incomplete arguments, expected 2 (userid, role)",
    });
  }
});

module.exports = router;
