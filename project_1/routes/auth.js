import express from "express";
import { getDB } from "../db/index.js";
import { Collection } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// const user = { username: "Alice", password: "64924629346" };

// await getDB collection("users").insertOne(user);

// POST /auth/register user
// router.post("/register", (req, res) => {});
router.post("/register", async (req, res) => {
  try {
    const { username, password, email, name } = req.body;

    // Проверка полей
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password required",
      });
    }

    const db = getDB();

    // Аналог users.find(...)
    const user = await db.collection("users").findOne({ username });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = {
      username,
      password: await bcrypt.hash(password, 10),
      email,
      name,
    };

    // Аналог users.push(newUser)
    const result = await db.collection("users").insertOne(newUser);

    res.status(201).json({
      message: "User was registered successfully!",
      id: result.insertedId,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error!",
    });
  }
});

// POST /auth/login - login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const db = getDB();

    // Аналог users.find(...)
    const user = await db.collection("users").findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: "User or password invalid",
      });
    }

    const check = await bcrypt.compare(password, user.password);

    if (!check) {
      return res.status(404).json({
        message: "User or password invalid",
      });
    }

    // создаём JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        token: token,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error!",
    });
  }
});

export default router;
