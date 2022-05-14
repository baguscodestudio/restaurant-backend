"use strict";
const express = require("express");
let router = express.Router();
const connection = require("../models/index");

router.post("/", async (req, res) => {
  const { name, price, category, description, photo } = req.body;

  if (name && price && category && description && photo) {
    const [result, field] = await connection.execute(
      "INSERT INTO item (name, price, description, category, photo) VALUES (?,?,?,?,?)",
      [name, price, description, category, photo]
    );

    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: "Added item successfully",
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
        "Incomplete arguments, expected 5 (name, price, category, description, photo)",
    });
  }
});

router.get("/", async (req, res) => {
  const [result, field] = await connection.execute("SELECT * FROM item");
  res.status(200).json(result);
});

router.put("/:id", async (req, res) => {
  const itemid = req.params.id;
  const { name, price, category, description, photo } = req.body;
  if (itemid && name && price && category && description && photo) {
    const [result, field] = await connection.execute(
      "UPDATE item SET name=?, price=?,description=?,category=?,photo=? WHERE itemid=?",
      [name, price, description, category, photo, itemid]
    );

    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: "Added item successfully",
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
        "Incomplete arguments, expected 6 (itemid, name, price, category, description, photo)",
    });
  }
});

router.delete("/:id", async (req, res) => {
  const itemid = req.params.id;

  if (itemid) {
    const [result, field] = await connection.execute(
      "DELETE FROM item WHERE itemid=?",
      [itemid]
    );

    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: "Removed item successfully",
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
      message: "Incomplete arguments, expected 1 (itemid)",
    });
  }
});

module.exports = router;
