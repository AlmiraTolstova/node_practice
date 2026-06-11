import express from "express";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// POST /api/balance/set-balance
router.post("/set-balance", async (req, res) => {
  try {
    const { initialBalance } = req.body;

    // Проверка наличия
    if (initialBalance === undefined) {
      return res.status(400).json({
        message: "Initial balance is required",
      });
    }

    if (typeof initialBalance !== "number") {
      return res.status(400).json({
        message: "Initial balance must be a number",
      });
    }
    if (initialBalance < 0) {
      return res.status(400).json({
        message: "Initial balance cannot be negative",
      });
    }

    const user = await User.create({
      initialBalance,
      currentBalance: initialBalance,
      transactions: [],
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// POST /api/balance/add-balance
router.post("/add-balance", async (req, res) => {
  try {
    const { amount } = req.body;

    // Проверка наличия суммы и типа
    if (amount === undefined) {
      return res.status(400).json({
        message: "Amount is required",
      });
    }
    if (typeof amount !== "number") {
      return res.status(400).json({
        message: "Amount must be a number",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const transaction = await Transaction.create({
      type: "income",
      amount,
    });

    user.currentBalance += amount;

    user.transactions.push(transaction._id);

    await user.save();

    const updatedUser = await User.findById(user._id).populate("transactions");

    res.status(200).json({
      message: "Balance updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

export default router;
