"use strict";
const express = require("express");
let router = express.Router();
const connection = require("../models/index");

router.get("/", async (req, res) => {
  const [result, fields] = await connection.execute("SELECT * FROM cart");
  res.json(result);
});

router.get("/:id", async (req, res) => {
  const tablenum = req.params.id;
  if (tablenum) {
    const [result, fields] = await connection.execute(
      "SELECT * FROM cart LEFT JOIN item ON cart.itemid = item.itemid WHERE tablenum=?",
      [tablenum]
    );

    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(500).json({
        success: false,
        message: "No rows were selected",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Incomplete arguments, expected 1 (params:Tablenum)",
    });
  }
});

router.post("/:id", async (req, res) => {
  const tablenum = req.params.id;
  const { item } = req.body;
  if (item) {
    const [result, fields] = await connection.execute(
      "INSERT INTO cart VALUES(?,?,?)",
      [tablenum, item.itemid, item.quantity]
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
      message: "Incomplete arguments, expected 1 (item object)",
    });
  }
});

router.put("/:id", async (req, res) => {
  const tablenum = req.params.id;
  const { item } = req.body;
  if (tablenum && item) {
    const [result, field] = await connection.execute(
      "UPDATE cart SET quantity=? WHERE tablenum=? AND itemid=?",
      [item.quantity, tablenum, item.itemid]
    );
    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: "Updated Item from table successfully",
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
        "Incomplete arguments, expected 2 (params: tablenum, body: item object)",
    });
  }
});

router.delete("/:id/:item", async (req, res) => {
  const tablenum = req.params.id;
  const itemid = req.params.item;
  if (tablenum && itemid) {
    const [result, fields] = await connection.execute(
      "DELETE FROM cart WHERE tablenum=? AND itemid=?",
      [tablenum, itemid]
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
      message: "Incomplete arguments, expected 2 (params: tablenum, itemid)",
    });
  }
});

module.exports = router;
