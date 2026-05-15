const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authMiddleware = (req, res, next) => {
  try {
    console.log(req.headers.authorization);

    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    console.log("TOKEN:", token);

    if (!token) {
      return res.status(401).json({
        message: "Authentication Required",
      });
    }

    const verified = jwt.verify(token, process.env.secretKey);

    console.log("VERIFIED:", verified);

    req.user = verified;

    next();
  } catch (err) {
    console.log(err.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// roles authorization
exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Please login",
      });
    }

    if (!roles.includes(req.user.usertype)) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    next();
  };
};