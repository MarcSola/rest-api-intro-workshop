// importing jsonwebtoken and config to create
// the new  jsonwebtoken
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { ACCESS_TOKEN_SECRET } = process.env;

// the token param is the token received from the request (need to double-check this)
async function verifyAuthToken(token) {
  // we return a promise to avoid having to manage
  // this situation in the controller file
  return new Promise(function verifyAuthTokenHandler(resolve, reject) {
    const res = jwt.verify(token, ACCESS_TOKEN_SECRET);
    // console.log(res);
    // logic control for failure
    if (!res) reject("JWT validation error!");
    // logic control for success. res: payload
    // specified when egenrating token
    resolve(res);
  });
}

module.exports = {
  verifyAuthToken: verifyAuthToken,
};
