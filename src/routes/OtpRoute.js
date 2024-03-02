const {
  generateOTPRequest,
  verifyOTPRequest,
} = require("../controllers/UserController");

const router = require("express").Router();

module.exports = (app) => {
  router.post("/send", generateOTPRequest);
  router.post("/verify", verifyOTPRequest);

  app.use("/api/otp", router);
};
