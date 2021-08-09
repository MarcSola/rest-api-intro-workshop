const { getAuthToken } = require("./get-auth-token");
const { verifyAuthToken } = require("./verify-auth-token");
const { generateAccessToken } = require("./generate-access-token");

module.exports = {
  generateAccessToken: generateAccessToken,
  getAuthToken: getAuthToken,
  verifyAuthToken: verifyAuthToken,
};