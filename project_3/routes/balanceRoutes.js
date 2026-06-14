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
    const { amount, userId } = req.body;

    // Проверка наличия userId
    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }
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

    const user = await User.findById(userId);
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

// POST /api/balance/add-expense
router.post("/add-expense", async (req, res) => {
  try {
    const { amount, userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

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

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.currentBalance < amount) {
      return res.status(400).json({
        message: "Insufficient funds",
      });
    }

    const transaction = await Transaction.create({
      type: "expense",
      amount,
    });

    user.currentBalance -= amount;
    user.transactions.push(transaction._id);

    await user.save();

    const updatedUser = await User.findById(user._id).populate("transactions");

    res.status(200).json({
      message: "Expense added successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// GET /api/balance?userId=123
router.get("/balance", async (req, res) => {
  try {
    const { userId } = req.query;

    // Проверка наличия userId
    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    // Поиск пользователя и загрузка транзакций
    const user = await User.findById(userId).populate("transactions");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      currentBalance: user.currentBalance,
      transactions: user.transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

export default router;
