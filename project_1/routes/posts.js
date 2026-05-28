import express from "express";
import authenticateJWT from "../middlewares/authMiddleware.js";
import { getDB } from "../db/index.js";

const router = express.Router();

//POST /posts/ - create post
router.post("/posts", authenticateJWT, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.userId;

    // Проверка полей
    if (title === undefined || content === undefined) {
      return res.status(400).json({
        message: "Username and password required",
      });
    }

    const db = getDB();

    const newPost = {
      userId: userId,
      title: title,
      content: content,
    };

    //  posts.push(newPost)
    const result = await db.collection("posts").insertOne(newPost);

    res.status(201).json({
      message: "Post was registered successfully!",
      id: result.insertedId,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error!",
    });
  }
});

// router.post("/");
//GET /posts - fetch all posts
// router.get("/");
router.get("/posts", async (req, res) => {
  try {
    const db = getDB();

    const posts = await db.collection("posts").find({}).toArray();

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get posts",
    });
  }
});

export default router;
