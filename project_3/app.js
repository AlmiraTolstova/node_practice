import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import balanceRoutes from "./routes/balanceRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/balance", balanceRoutes);

app.get("/", (req, res) => {
  res.status(201).json({
    message: "api server",
  });
});

connectDB();

try {
  console.log("Successfully connected to MongoDB!");
  app.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port}`);
  });
} catch (error) {
  console.error(error);
}
