import express from "express";
import authRoutes from "./routes/auth.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import taskRoutes from "./routes/task.js";

const app = express();
dotenv.config({
  path: "/Users/almiratolstova/Documents/Projects/ICH/node_practice/project_4/.env",
});
const port = process.env.PORT || 3000;
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
