import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3333;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Sequelize + Express");
});

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connected successfully.");
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.log("Database connection error:", error);
  }
});
