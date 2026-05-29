import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import habitsRouter from "./routes/habits.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3333;

app.use(express.json());

app.use("/habits", habitsRouter);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://127.0.0.1:${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
