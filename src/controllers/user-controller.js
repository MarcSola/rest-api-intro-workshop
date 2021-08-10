// Importing user model from models we named it db to give
// the same feeling as when we use the mongo console to
// interact with the database
const db = require("../models");

const jwt = require("jsonwebtoken");
const config = require("../config");

const { encryptString, compareEncrypted } = require("../utils/encrypt");
const { generateAccessToken } = require("../services/auth");
const sessionData = require("../session/session-data");
const randToken = require("rand-token");

// register new user
async function register(req, res, next) {
  const { firstName, lastName, email, password } = req.body;

  try {
    const foundUser = await db.User.findOne({ email: email });
    if (!foundUser) {
      const { _id } = await db.User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: await encryptString(password),
        active: true,
      });

      return res.status(200).send({
        message: "User created successfully",
        data: {
          id: _id,
          email: email,
        },
      });
    } else {
      return res.status(201).send("User already exists");
    }
  } catch (err) {
    return res.status(500).send({
      error: err,
    });
  }
}

// user sign in
async function userSignIn(req, res, next) {
  const { email, password } = req.body;
  try {
    const foundUser = await db.User.findOne({ email: email });
    if (foundUser === null) {
      return res.status(400).send(`User does not exist`);
    } else {
      const matchPassword = await compareEncrypted({
        plainData: password,
        encryptedData: foundUser.password,
      });
      if (matchPassword) {
        // generate the access token
        const accessToken = generateAccessToken({ foundUser });

        // generating random refresh token and storing it
        // in the session data key.
        const refreshToken = randToken.generate(256);
        sessionData.refreshTokens[refreshToken] = foundUser.email;

        // return response
        return res.status(200).send({
          message: `Welcome ${foundUser.firstName}`,
          accessToken: accessToken,
          refreshToken: refreshToken,
          id: foundUser._id,
        });
      } else if (!matchPassword) {
        return res.status(400).send(`Wrong password`);
      }
    }
  } catch (err) {
    return res.status(500).send({
      error: err,
    });
  }
}

// get all current users
async function getUsers(req, res, next) {
  try {
    const users = await db.User.find();
    return res.status(201).json(users);
    // return res.status(201).send({
    //   message: "Users found successfully",
    //   data: users,
    // });
  } catch (err) {
    return res.status(500).send({
      error: err,
    });
  }
}

// get an specific user filtered by Id
async function getUserById(req, res, next) {
  try {
    const user = await db.User.findById(req.params.id);
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).send({
      error: err,
    });
  }
}

// update an specific user filtered by Id
async function updateUserById(req, res, next) {
  try {
    const updatedUser = await db.User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).send({
      error: err,
    });
  }
}

// delete an specific user filtered by Id
async function deleteUserById(req, res, next) {
  try {
    await db.User.findByIdAndDelete(req.params.id);
    return res.status(204).json();
  } catch (err) {
    return res.status(500).send({
      error: err,
    });
  }
}

// refreshes the token
async function refreshToken(req, res, next) {
  const { email, refreshToken } = req.body;
  try {
    if (
      refreshToken in sessionData.refreshTokens &&
      sessionData.refreshTokens[refreshToken] === email
    ) {
      const accessToken = generateAccessToken({ email: email });
      return res.status(200).send({
        isSuccessful: true,
        message: `Welcome ${email}`,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    }
  } catch (err) {
    return res.status(401).send({
      error: err.message,
    });
  }
}

module.exports = {
  register: register,
  userSignIn: userSignIn,
  refreshToken: refreshToken,
  getUsers: getUsers,
  getUserById: getUserById,
  updateUserById: updateUserById,
  deleteUserById: deleteUserById,
};
