const { getAuthToken, verifyAuthToken } = require("../services/auth");
const db = require("../models");

async function authMiddleware(req, res, next) {
    try {
      const bearerToken = await getAuthToken(req.headers);
      const userClaims = await verifyAuthToken(bearerToken);
  
      const user = await db.User.findOne({
        email: userClaims.email,
      });
  
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
        error: error,
      });
    }
  }
  
  module.exports = {
    authMiddleware: authMiddleware,
  };
  