require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const server = express();
const apiRouter = require("./api");

// Setup your Middleware and API Router here
server.use(cors());
server.use(morgan("dev"));
server.use(express.json());
server.use("/api", apiRouter);

server.use((req, res, next) => {
  res.status(404).send("Page not found");
});

server.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err });
});

module.exports = app;
