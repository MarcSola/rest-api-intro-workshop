const { getAuthToken, verifyAuthToken } = require("../services/auth");
const db = require("../models");

async function authMiddleware(req, res, next) {
  try {
    // Checking authoritzation header and getting the auth token
    const bearerToken = await getAuthToken(req.headers);

    // Verifying the auth token
    const userClaims = await verifyAuthToken(bearerToken);

    const user = await db.User.find({
      email: userClaims.email,
    });
    console.log(user);
    if (!user) {
      throw new Error("Invalid token");
    }

    req.user = {
      email: userClaims.email,
      id: user._id,
    };

    next();
  } catch (error) {
    res.status(401).send({
      data: null,
      error: error.message,
    });
  }
}

module.exports = {
  authMiddleware: authMiddleware,
};
