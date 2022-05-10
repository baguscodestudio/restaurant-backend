"use strict";
const express = require("express");
let router = express.Router();
const connection = require("../models/index");

router.post("/", async (req, res) => {
  const { tablenum, price, status } = req.body;
  if (tablenum && price && status) {
    const [result, field] = await connection.execute(
      "INSERT INTO `order` (tablenum, price, `status`) VALUES (?,?,?)",
      [tablenum, price, status]
    );

    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: "Added Item to table successfully",
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
      message: "Incomplete arguments, expected 3 (tablenum, price, status)",
    });
  }
});

router.put("/:id", async (req, res) => {
  const tablenum = req.params.id;
  const { status } = req.body;
  if (tablenum && status) {
    const [result, field] = await connection.execute(
      "UPDATE order SET status=? WHERE tablenum=?",
      [status, tablenum]
    );
    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: "Added Item to table successfully",
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
        "Incomplete arguments, expected 2 (params:tablenum, body: status)",
    });
  }
});

module.exports = router;
