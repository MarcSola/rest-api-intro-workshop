// Importing user model from models we named it db to give
// the same feeling as when we use the mongo console to
// interact with the database
const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config");

const { encryptString, compareEncrypted } = require("../utils/encrypt");

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
    if(foundUser === null) {
      return res.status(400).send(`User does not exist`);
    }else{

      const matchPassword = await compareEncrypted({
        plainData: password,
        encryptedData: foundUser.password,
      }
      );
      if (foundUser && matchPassword) {
        return res.status(200).send(`Welcome ${foundUser.firstName}`);
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

// async function signUp(req, res, next) {
//   const { email, password, firstName, lastName } = req.body;

//   try {
//     const encryptedPassword = await encryptString(password);
//     const { _id } = await db.User.create({
//       email: email,
//       password: encryptedPassword,
//       firstName: firstName,
//       lastName: lastName,
//       active: true,
//     });

//     return res.status(200).send({
//       id: _id,
//       email,
//     });
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// }

// async function fetchUsers(req, res, next) {
//   try {
//     const users = await db.User.find().lean();

//     res.status(200).send({
//       data: users,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// async function fetchUserById(req, res, next) {
//   const {
//     params: { id: userId },
//   } = req;

//   try {
//     const user = await db.User.findById(userId).lean();

//     res.status(200).send({
//       data: user,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// async function updateUser(req, res, next) {
//   const { id: userId } = req.params;
//   const { firstName, lastName } = req.body;

//   try {
//     const updatedUser = await db.User.findOneAndUpdate(
//       {
//         _id: userId,
//       },
//       {
//         $set: {
//           firstName: firstName,
//           lastName: lastName,
//         },
//       },
//       {
//         new: true,
//       },
//     ).select({
//       firstName: 1,
//       lastName: 1,
//     });

//     res.status(200).send({
//       data: updatedUser,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// async function deleteUser(req, res, next) {
//   const { id: userId } = req.params;

//   try {
//     const result = await db.User.deleteOne({
//       _id: userId,
//     }).lean();

//     if (result.ok === 1 && result.deletedCount === 1) {
//       res.status(200).send({
//         data: "User removed",
//       });
//     } else {
//       res.status(500).send({
//         data: "User not removed",
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// }

// module.exports = {
//   signUp: signUp,
//   fetchUsers: fetchUsers,
//   fetchUserById: fetchUserById,
//   updateUser: updateUser,
//   deleteUser: deleteUser,
// };

module.exports = {
  register: register,
  userSignIn: userSignIn,
  getUsers: getUsers,
  getUserById: getUserById,
  updateUserById: updateUserById,
  deleteUserById: deleteUserById,
};

