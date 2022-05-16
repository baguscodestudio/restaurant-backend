"use strict";
const express = require("express");
let router = express.Router();
const connection = require("../models/index");

router.get("/", async (req, res) => {
  const [result, fields] = await connection.execute("SELECT * FROM `order`");
  let orders = await Promise.all(
    result.map(async (order, index) => {
      const [result, fields] = await connection.execute(
        "SELECT * FROM cart LEFT JOIN item ON cart.itemid = item.itemid WHERE tablenum=?",
        [order.tablenum]
      );

      return {
        orderid: order.orderid,
        tablenum: order.tablenum,
        total: order.price,
        items: result,
      };
    })
  );
  res.status(200).json(orders);
});

router.get("/:table", async (req, res) => {
  const tablenum = req.params.table;

  if (tablenum) {
    const [result, fields] = await connection.execute(
      "SELECT * FROM `order` WHERE tablenum=?",
      [tablenum]
    );
    const [resultCart, fieldsCart] = await connection.execute(
      "SELECT * FROM cart LEFT JOIN item ON cart.itemid = item.itemid WHERE tablenum=?",
      [tablenum]
    );
    if (result.length > 0 && resultCart.length > 0) {
      res.status(200).json({
        orderid: result.orderid,
        tablenum: result.tablenum,
        total: result.price,
        items: resultCart,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "No rows were found",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Incomplete arguments, expected 2 (tablenum, price)",
    });
  }
});

router.post("/search", async (req, res) => {
  const { query } = req.body;
  if (query) {
    const table = "`order`";
    const [result, fields] = await connection.execute(
      `SELECT * FROM ${table} WHERE tablenum LIKE '%${query}%'`
    );
    let orders = await Promise.all(
      result.map(async (order, index) => {
        const [result, fields] = await connection.execute(
          "SELECT * FROM cart LEFT JOIN item ON cart.itemid = item.itemid WHERE tablenum=?",
          [order.tablenum]
        );

        return {
          orderid: order.orderid,
          tablenum: order.tablenum,
          total: order.price,
          items: result,
        };
      })
    );
    res.status(200).json(orders);
  } else {
    res.status(400).json({
      success: false,
      message: "Incomplete arguments, expected 1 (query)",
    });
  }
});

router.post("/", async (req, res) => {
  const { tablenum, price } = req.body;
  if (tablenum && price) {
    const [resultExist, fieldExist] = await connection.execute(
      "SELECT * FROM `order` WHERE tablenum=?",
      [tablenum]
    );
    if (resultExist.length > 0) {
      res.status(500).json({
        success: false,
        message: "You already ordered!",
      });
    } else {
      const [result, field] = await connection.execute(
        "INSERT INTO `order` (tablenum, price) VALUES (?,?)",
        [tablenum, price]
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
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Incomplete arguments, expected 2 (tablenum, price)",
    });
  }
});

router.post("/complete/:id", async (req, res) => {
  const orderid = req.params.id;
  const { order } = req.body;
  if (orderid && order) {
    console.log(orderid, order.total, order.items);
    const [result, field] = await connection.execute(
      "INSERT INTO order_complete VALUES(?,?,?,?)",
      [
        orderid,
        order.total,
        JSON.stringify(order.items),
        new Date().toISOString().slice(0, 19).replace("T", " "),
      ]
    );
    if (result.affectedRows > 0) {
      const [result, field] = await connection.execute(
        "DELETE FROM `order` WHERE orderid=?",
        [orderid]
      );
      const [resultCart, fieldCart] = await connection.execute(
        "DELETE FROM cart WHERE tablenum=?",
        [order.tablenum]
      );
      if (result.affectedRows > 0 && resultCart.affectedRows > 0) {
        res.json({
          success: true,
          message: "Marked order complete successfully",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "No rows were updated",
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: "No rows were updated",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Incomplete arguments, expected 2 (params:tablenum, body:order)",
    });
  }
});

router.put("/:id", async (req, res) => {
  const orderid = req.params.id;
  const { price, items } = req.body;

  if (orderid && price && items) {
    const [result, field] = await connection.execute(
      "UPDATE `order` SET price=? WHERE orderid=?",
      [price, orderid]
    );
    items.map(async (item, index) => {
      const [result, field] = await connection.execute(
        "UPDATE `cart` SET quantity=? WHERE tablenum=? AND itemid=?",
        [item.quantity, item.tablenum, item.itemid]
      );
    });
    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: "Updated order successfully",
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
        "Incomplete arguments, expected 3 (params:tablenum, body: price, items)",
    });
  }
});

router.put("/status/:id", async (req, res) => {
  const orderid = req.params.id;
  const { status } = req.body;
  if (orderid && status) {
    const [result, field] = await connection.execute(
      "UPDATE `order` SET status=? WHERE orderid=?",
      [status, orderid]
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

router.delete("/:id", async (req, res) => {
  const orderid = req.params.id;

  if (orderid) {
    const [result, field] = await connection.execute(
      "SELECT tablenum FROM `order` WHERE orderid=? LIMIT 1",
      [orderid]
    );
    const [resultDelete, fieldDelete] = await connection.execute(
      "DELETE FROM `order` WHERE orderid=?",
      [orderid]
    );
    if (resultDelete.affectedRows > 0) {
      const [resultCart, fieldCart] = await connection.execute(
        "DELETE FROM cart WHERE tablenum=?",
        [result[0].tablenum]
      );
      if (resultCart.affectedRows > 0) {
        res.json({
          success: true,
          message: "Deleted order successfully",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "No rows were deleted in cart",
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: "No rows were deleted in order",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Incomplete arguments, expected 1 (params:orderid)",
    });
  }
});

module.exports = router;
