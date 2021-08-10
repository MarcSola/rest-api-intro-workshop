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
userRouter.get("/", authMiddleware, userController.getUsers);

// get user by id
userRouter.get("/:id", authMiddleware, userController.getUserById);

// register new user
userRouter.post("/register", authMiddleware, userController.register);

// user sign in
userRouter.post("/signin", userController.userSignIn);

// user sign in
userRouter.post("/refreshtoken", userController.refreshToken);

// update user
userRouter.patch("/:id", authMiddleware, userController.updateUserById);

// delete user
userRouter.delete("/:id", authMiddleware, userController.deleteUserById);

module.exports = userRouter;
