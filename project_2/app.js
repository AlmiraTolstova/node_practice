import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();

const app = express();

// const dbURI = process.env.MONGO_URI || "url";
const port = process.env.PORT || 3000;

app.use(express.json());

connectDB();

app.use("/api/cart", cartRoutes);

// startServer();

// async function startServer() {
//   try {
//     await mongoose.connect(dbURI);

//     console.log("Successfully connected to MongoDB!");
//     app.listen(port, () => {
//       console.log(`Server started at http://127.0.0.1:${port}`);
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }

app.listen(port, () => {
  console.log(`Server started at http://127.0.0.1:${port}`);
});
