const { auth } = require("../services/firebase-auth/firebase");
// const db = require("../models");

async function authMiddleware(req, res, next) {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    // the authorization token is coming in as:
    // Bearer eyJhb.....
    const bearerToken = req.headers.authorization.substr(7);
    try {
      const userClaims = await auth.verifyIdToken(bearerToken);

      const { email, uid } = userClaims;

      req.user = {
        email: email,
        id: uid,
      };

      next();
    } catch (error) {
      next(error);
    }
  } else {
    res.status(401).send({
      data: null,
      error: "Unauthorized",
    });
  }
}

module.exports = {
  authMiddleware: authMiddleware,
};
