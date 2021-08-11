// The router method from the express dependency allows
// to create objects to manage the routing.
const Router = require("express").Router;
const userRouter = Router();

// Importing auth middleware to check token validity
const { authMiddleware } = require("../middlewares");
// Importing userController to use its function for the requests
const { userController } = require("../controllers");

// Routing for every request/response

// get all users
userRouter.get("/users", authMiddleware, userController.getUsers);

// get user by id
userRouter.get("/users/:id", authMiddleware, userController.getUserById);

// register new user
// userRouter.post("/users/register", authMiddleware, userController.register);

// user sign in
userRouter.post("/users/signin", authMiddleware, userController.userSignIn);

// user sign in
// userRouter.post("/users/refreshtoken", userController.refreshToken);

// update user
userRouter.patch("/users/:id", authMiddleware, userController.updateUserById);

// delete user
userRouter.delete("/users/:id", authMiddleware, userController.deleteUserById);

module.exports = userRouter;
