import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());
const users = [
  {
    id: 0,
    username: "alex",
    password: await bcrypt.hash("alex123", 10),
    email: "alex@email.com",
    name: "Alex",
  },
  {
    id: 1,
    username: "sophie",
    password: await bcrypt.hash("sophie123", 10),
    email: "sophie@email.com",
    name: "Sophie",
  },
];

app.post("/register", async (req, res) => {
  try {
    const { username, password, email, name } = req.body;
    const newUser = {
      id: users.length + 1,
      username,
      password: await bcrypt.hash(password, 10),
      email,
      name,
    };

    users.push(newUser);
    console.log(users);

    res.status(201).send("User was registered successfully!");
  } catch (err) {
    res.status(500).send("Error!");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find((item) => item.username === username);
    if (user !== undefined) {
      const check = await bcrypt.compare(password, user.password);
      if (check) {
        console.log(users);
        res.json({
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
          },
        });
      } else {
        res.status(404).send("Error! User or password invalid");
      }
    } else {
      res.status(404).send("Error! User or password invalid");
    }
  } catch (err) {
    res.status(500).send("Error! User or password invalid");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
