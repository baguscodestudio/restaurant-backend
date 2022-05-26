"use strict";
const express = require("express");
let router = express.Router();
const connection = require("../models/index");

router.get("/", async (req, res) => {
  const [result, fields] = await connection.execute("SELECT * FROM coupon");
  res.json(result);
});

router.post("/:id", async (req, res) => {
  const code = req.params.id;
  const { discount, expire } = req.body;
  if ((code, discount, expire)) {
    const [result, fields] = await connection.execute(
      "INSERT INTO coupon VALUES(?,?,?)",
      [
        code,
        discount,
        new Date(expire).toISOString().slice(0, 19).replace("T", " "),
      ]
    );

    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: "Added Coupon to table successfully",
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
      message:
        "Incomplete arguments, expected 3 (params: code, body: discount, date)",
    });
  }
});

router.delete("/:id", async (req, res) => {
  const code = req.params.id;
  if (code) {
    const [result, fields] = await connection.execute(
      "DELETE FROM coupon WHERE code=?",
      [code]
    );

    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: "Deleted coupon successfuly",
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
      message: "Incomplete arguments, expected 1 (params: code)",
    });
  }
});

module.exports = router;
