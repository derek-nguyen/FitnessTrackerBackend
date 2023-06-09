/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
  getPublicRoutinesByUser,
  getAllRoutinesByUser,
} = require("../db");

const { requireUser } = require("./utils");

// POST /api/users/register

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  const existingUser = await getUserByUsername(username);

  // console.log('Existing user', existingUser)

  try {
    if (existingUser) {
      res.status(409).send({
        error: `A user with the username ${username} already exists.`,
        message: `User ${username} is already taken.`,
        name: "UsernameExistsError",
      });
    } else if (password.length < 8) {
      res.status(409).send({
        error: `Password must be at least 8 characters long.`,
        message: `Password Too Short!`,
        name: "PasswordLengthError",
      });
    } else {
      const newUser = await createUser({
        username,
        password,
      });
      // console.log('New user created', newUser)

      const response = {
        message: "Successfully created user!",
        token: "random token",
        user: newUser,
      };
      res.send(response);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/users/login

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  const user = await getUserByUsername(username);

  if (user && (await bcrypt.compare(password, user.password))) {
    const payload = {
      id: user.id,
      username: user.username,
    };
    const token = jwt.sign(payload, JWT_SECRET);

    const response = {
      user: { id: user.id, username: username },
      message: `you're logged in!`,
      token: token,
    };

    res.send(response);
  } else {
    res.status(401).send({
      error: `Username or password is incorrect.`,
      message: `Username or password is incorrect.`,
      name: "IncorrectCredentialsError",
    });
  }
});

// GET /api/users/me

router.get("/me", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).send({
        error: "No token provided",
        message: "You must be logged in to perform this action",
        name: "NoTokenError",
      });
    } else {
      const token = authHeader.split(" ")[1];
      const decodedUser = jwt.verify(token, JWT_SECRET);
      res.send(decodedUser);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/users/:username/routines

router.get("/:username/routines", async (req, res, next) => {
  const { username } = req.params;

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedUser = jwt.verify(token, JWT_SECRET);
    const loggedInUsername = decodedUser.username;

    if (username === loggedInUsername) {
      const allRoutines = await getAllRoutinesByUser({ username });
      res.send(allRoutines);
    } else {
      const publicRoutinesByUser = await getPublicRoutinesByUser({
        username: username,
      });
      res.send(publicRoutinesByUser);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
