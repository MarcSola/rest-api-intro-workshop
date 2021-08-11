// The mongoose dependency is used to create the
// schema for the entries and the model to export
const mongoose = require("mongoose");

// the bcrypt dependency is used to create encrypted
// strings. In this case it will be used to encrypt 
// the password
const bcrypt = require("bcrypt");

// The validator dependency allows to use validator
// validation functions
const { isEmail } = require("validator");
// const { Schema } = require("mongoose");

// the timestamps key for the schema autogenerates
// the timestamps for the entry creation and its
// modification
const UserSchema = mongoose.Schema(
  {
    firebaseId:{
      type: String,
      trim: true,
      unique: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "The email is required"],
      trim: true,
      unique: true,
      validate: {
        validator: (value) => isEmail(value),
        message: (props) => `The email ${props.value} is not valid`,
      },
    },
    password: {
      type: String,
      unique: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  },
);

// Schema methods
UserSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

UserSchema.statics.comparePassword = async (receivedPassword, password ) => {
  return await bcrypt.compare(receivedPassword, password);
}

// The mongoose.model allows us to call the
// mongo functions to interact with the database
const User = mongoose.model("user", UserSchema);

module.exports = User;
