import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import User from "./models/Users.js";

dotenv.config({
  path: "/Users/almiratolstova/Documents/Projects/ICH/node_practice/practicum_6/.env",
});

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

async function createUser(userName, userEmail, userAge) {
  try {
    const newUser = await User.create({
      name: userName,
      email: userEmail,
      age: userAge,
    });
    console.log("user created", newUser.toJSON);
    return newUser;
  } catch (error) {
    console.error("Failed to create user:", error);
  }
}

app.post("/users", async (req, res) => {
  const { name, email, age } = req.body;
  if (
    (name !== undefined && name.length > 0 && email !== undefined) ||
    (email.length > 0 && age > 0)
  ) {
    const newUser = await createUser(name, email, age);
    if (newUser !== undefined) {
      res
        .json({
          status: "success",
          message: "Successfull created new User!",
          data: {
            newUser,
          },
        })
        .status(200);
    } else {
      res
        .json({
          status: "error",
          message: "server error",
          data: {},
        })
        .status(500);
    }
  } else {
    res
      .json({
        status: "error",
        message: "invalid parameters",
        data: {},
      })
      .status(400);
  }
});

app.get("/users", async (req, res) => {
  const users = await getUsers();
  if (users !== undefined) {
    res
      .json({
        status: "success",
        message: "Successfull got users list!",
        data: {
          users,
        },
      })
      .status(200);
  } else {
    res
      .json({
        status: "error",
        message: "error with getting users",
        data: {},
      })
      .status(400);
  }
});

app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await getUserById(userId);
  if (user !== undefined) {
    res
      .json({
        status: "success",
        message: "Successfull found user!",
        data: {
          user,
        },
      })
      .status(200);
  } else {
    res
      .json({
        status: "unsuccessfull",
        message: "user not found",
        data: {},
      })
      .status(400);
  }
});

app.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const { name, email, age } = req.body;
  const result = await updateUser(userId, name, email, age);
  if (result > 0) {
    res
      .json({
        status: "success",
        message: "Successfull changed user!",
        data: {
          result,
        },
      })
      .status(200);
  } else {
    res
      .json({
        status: "unsuccessfull",
        message: "user was not changed",
        data: {},
      })
      .status(400);
  }
});

app.patch("/users/:id", async (req, res) => {
  const userId = Number(req.params.id);
  const result = await patchUser(userId, req.body);
  if (result > 0) {
    res
      .json({
        status: "success",
        message: "Successfull changed user!",
        data: {
          result,
        },
      })
      .status(200);
  } else {
    res
      .json({
        status: "unsuccessfull",
        message: "user was not changed",
        data: {},
      })
      .status(400);
  }
});

app.delete("/users/:id", async (req, res) => {
  const userId = Number(req.params.id);
  const result = await deleteUser(userId);
  if (result > 0) {
    res
      .json({
        status: "success",
        message: "Successfull deleted user!",
        data: {
          result,
        },
      })
      .status(200);
  } else {
    res
      .json({
        status: "unsuccessfull",
        message: "user was not deleted",
        data: {},
      })
      .status(400);
  }
});

async function getUsers() {
  try {
    const users = await User.findAll();
    console.log("All users");
    return users;
  } catch (error) {
    console.error("Error finding users:", error);
    return undefined;
  }
}

async function getUserById(userId) {
  try {
    const user = await User.findOne({
      where: { id: userId },
    });
    if (user) {
      return user;
    } else {
      return undefined;
    }
  } catch (error) {
    return undefined;
  }
}

async function updateUser(userId, newName, newEmail, newAge) {
  try {
    const [updatedRowsCount] = await User.update(
      {
        name: newName,
        email: newEmail,
        newAge,
      },
      { where: { id: userId } },
    );
    return updatedRowsCount;
  } catch (error) {
    return undefined;
  }
}

async function patchUser(userId, data) {
  try {
    const allowedFields = ["name", "email", "age"];

    const updateData = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    const [updatedRowsCount] = await User.update(updateData, {
      where: { id: userId },
    });

    return updatedRowsCount;
  } catch (error) {
    return undefined;
  }
}

async function deleteUser(userId) {
  try {
    const updatedRowsCount = await User.destroy({ where: { id: userId } });
    return updatedRowsCount;
  } catch (error) {
    return undefined;
  }
}
