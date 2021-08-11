// To create the app express needs to be imported
// helmet adds security headers and body-parser
// allows the app to work with the json format
// for the requests and reponses body
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { json } = require("body-parser");
const cors = require("cors");

// Imports for router and middleware variables
const routers = require("./routes");
// const { errorMiddleware } = require("./middlewares");

// Import for config variable
config = require("./config");

// Creating the app object using the express dependency
const app = express();

// To use the dependencies imported above in the app, the use method is called
// and the const for each dependency required is passed as param
app.use(morgan("dev"));
app.use(helmet());
app.use(json());
app.use(cors());

// Setting up base URL for the different router endpoints
app.use(routers.userRouter);
// app.use("/account", accountRouter);

app.get("/", (req, res) => {
  res.status(200).send({
    message: "hello-world default",
  });
});

// app.use(errorMiddleware);

module.exports = app;
