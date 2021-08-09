const Router = require("express").Router;

const { authController, userController } = require("../controllers");

const accountRouter = Router();

accountRouter.post("/authenticate", authController.authenticate);
accountRouter.post("/register", userController.signUp);

module.exports = accountRouter;

