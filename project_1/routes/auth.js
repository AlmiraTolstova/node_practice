import express from "express";
import { getDB } from "../db";
import { Collection } from "mongodb";

const router = express.Router();

const user = { username: "Alice", password: "64924629346" };

// await getDB collection("users").insertOne(user);
// POST /auth/register user
router.post("/register", (req, res) => {});

// POST /auth/login - login user
router.post("/login", (req, res) => {});

export default router;
