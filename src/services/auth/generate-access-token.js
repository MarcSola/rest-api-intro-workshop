// importing jsonwebtoken and config to create
// the new  jsonwebtoken
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { ACCESS_TOKEN_SECRET } = process.env;

// the data param can be either a string or an object.
// for more info check jsonwebtoken documentation
function generateAccessToken(data) {
  return jwt.sign(data, ACCESS_TOKEN_SECRET, { expiresIn: "180s" });
}

module.exports = { generateAccessToken };
