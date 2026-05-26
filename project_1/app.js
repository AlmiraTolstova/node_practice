import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import postsRouter from "./routes/posts.js";
import { connectDB } from "./db/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/auth", authRouter);
app.use("/posts", postRouter);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at http://127.0.0.1:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect db and start server!", error);
  });
