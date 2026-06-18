import express from "express";
import authRoutes from "./routes/auth.js";
import mongoose from "mongoose";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/testdb");

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
