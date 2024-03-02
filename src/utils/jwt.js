const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
// Secret key
const secretKey = process.env.JWT_SECRET || "secret";
const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

exports.createJWT = (user) => {
  // Membuat JWT dengan payload yang berisi informasi pengguna
  const payload = { userId: user };
  // JWT dengan secret key
  const token = jwt.sign(payload, secretKey, { expiresIn: expiresIn });
  return token;
};

exports.verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        res.status(400).json({
          errors: [err.message],
          message: "Token not valid",
          data: null,
        });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).json({
      errors: ["Unauthorized"],
      message: "Authorized is required",
      data: null,
    });
  }
};
