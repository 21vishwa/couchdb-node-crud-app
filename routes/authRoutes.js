const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { signup, login, getSignupUsers,logout } = require("../controllers/authController");

router.post("/signup", upload.single("image"), signup);
//router.post("/signup", signup);
router.post("/login", login);
router.get("/users", getSignupUsers);
router.post("/logout", logout);
router.post("/signup", upload.single("image"), signup);


module.exports = router;
