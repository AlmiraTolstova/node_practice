import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/cart
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// POST /api/cart
router.post("/", async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    if (!name || !quantity || !price) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newProduct = await Product.create({
      name,
      quantity,
      price,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
