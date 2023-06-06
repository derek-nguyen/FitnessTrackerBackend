require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const apiRouter = require("./api");

// Setup your Middleware and API Router here
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api", apiRouter);

app.use((req, res, next) => {
  res.status(404).send("Page not found");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err);
});

module.exports = app;
