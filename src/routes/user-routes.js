// The router method from the express dependency allows
// to create objects to manage the routing.
const Router = require("express").Router;
const userRouter = Router();

// Importing userController to use its function for the requests
const { userController } = require("../controllers");


// Routing for every request/response

// get all users
userRouter.get("/", userController.getUsers);

// get user by id
userRouter.get("/:id", userController.getUserById);

// register new user
userRouter.post("/register", userController.register);

// user sign in
userRouter.post("/signin", userController.userSignIn);

// update user
userRouter.patch("/:id", userController.updateUserById);

// delete user
userRouter.delete("/:id", userController.deleteUserById);

module.exports = userRouter;
