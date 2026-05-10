import express from "express";
import dotenv from "dotenv";
import connection from "./db/setup.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3245;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/users/:id", (req, res) => {
//   const userId = req.params.id;
//   const userName = req.params.name;
//   res.send(`User ID: ${userId}, User Name: ${userName}`);
// });

// app.get("/text", (req, res) => {
//   res.send("Hello, this is a text response!");
// });

// app.get("/json", (req, res) => {
//   res.json({ message: "Hello, this is a json response!" });
// });

// app.post("/submit", (req, res) => {
//   const { username, email } = req.body;
//   res.send(`Username: ${username}, Email: ${email}`);
// });

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;
//   res.json({
//     status: "success",
//     message: "Successfull Autorisation!",
//     data: {
//       id: 32874523674,
//       email,
//     },
//   });
// });

// app.get("/", (req, res) => {
//   res.send("Hello world!");
// });

// app.get("/users", (req, res) => {
//   res.send("List of users");
// });

// app.get("/users/:id", (req, res) => {
//   const userId = req.params.id;
//   res.send(`User id:${userId}`);
// });

// app.get("/search", (req, res) => {
//   const searchQuery = req.query.q;
//   res.send(`Search query:${searchQuery}`);
// });

app.get("/users", (req, res) => {
  res.send("List of users");
});

const users = [
  {
    id: 1,
    name: "Alice",
  },
  {
    id: 2,
    name: "Anna",
  },
  {
    id: 3,
    name: "Bob",
  },
];

app.get("/users/:id", (req, res, next) => {
  const userId = Number(req.params.id);
  const checkUser = users.find((user) => user.id === userId);
  if (!checkUser) {
    const error = new Error("User not found");
    error.status = 404;
    return next(error);
  }
  res.json({ status: "success", data: `User ID: ${userId}` });
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(error.status || 500).json({ message: error.message });
});

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port} `);
});

// fetch(url+"/submit", {method: "POST", body: JSON.stringify({username:"Alice", email: "alice@gmail.com"}), headers: {"Content-Type":"application/json"}})
