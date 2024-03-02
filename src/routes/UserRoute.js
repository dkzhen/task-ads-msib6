const {
  register,
  login,
  updatePhotoProfile,
} = require("../controllers/UserController");
const express = require("express");
const multer = require("multer");

const { storage } = require("../utils/multer");
const { verifyJWT } = require("../utils/jwt");
const router = express.Router();
const upload = multer({ storage: storage });

module.exports = (app) => {
  router.post("/register", register);
  router.post("/login", login);
  router.patch(
    "/update-photo/:userId",
    upload.single("file"),
    verifyJWT,
    updatePhotoProfile
  );

  app.use("/api/users", router);
};
