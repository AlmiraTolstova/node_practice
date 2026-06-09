import express from "express";
import User from "../models/User.js";

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

    // Проверка
    if (typeof initialBalance !== "number") {
      return res.status(400).json({
        message: "Initial balance must be a number",
      });
    }

    // Проверка -
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

export default router;
