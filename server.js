const http = require("http");
const chalk = require("chalk");
const app = require("./app");

const PORT = process.env["PORT"] ?? 3000;
const server = http.createServer(app);

//todo not able to use server.use
/*
const apiRouter = require("./api");
server.use("/api", apiRouter);
*/

//todo should we do this instead? but server is already being used
/*
const express = require('express');
const server = express();
*/
server.listen(PORT, () => {
  console.log(
    chalk.blueBright("Server is listening on PORT:"),
    chalk.yellow(PORT),
    chalk.blueBright("Get your routine on!")
  );
});
