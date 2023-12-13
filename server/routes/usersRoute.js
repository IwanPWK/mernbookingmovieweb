const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

// register a new user
router.post("/register", async (req, res) => {
  try {
    // check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "User already exists",
      });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // save the user
    const newUser = new User(req.body);
    await newUser.save();

    res.send({
      success: true,
      message: "Registration Successfull , Please login",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
