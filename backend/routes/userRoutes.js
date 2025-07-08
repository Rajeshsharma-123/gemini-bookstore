const express = require("express");
const router = express.Router();
const User = require("./../models/userModel");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

// POST route to add a person
router.post("/signup", async (req, res) => {
  try {
    const data = req.body;

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({
      email: data.email,
    });
    if (existingUser) {
      return res.status(400).json({
        error: "User with the same email already exists",
      });
    }

    const newUser = new User(data);
    const response = await newUser.save();
    console.log("User created successfully:", response);

    const payload = {
      id: response.id,
      role: response.role, // Include role in the token payload
    };
    const token = generateToken(payload);
    res.status(201).json({
      message: "User created successfully",
      user: response,
      token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Check if citizenshipNumber or password is missing
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    // Find the user by citizenshipNumber
    const user = await User.findOne({ email: email });

    // If user does not exist or password does not match, return error
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or Password" });
    }

    // generate Token
    console.log("User logged in successfully:", user);
    const token = generateToken(user);

    // return token as response
    res.json({ token , user});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Profile route
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Extract the id from the token
    const { currentPassword, newPassword } = req.body; // Extract current and new passwords from request body

    // Check if currentPassword and newPassword are present in the request body
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Both currentPassword and newPassword are required" });
    }

    // Find the user by userID
    const user = await User.findById(userId);

    // If user does not exist or password does not match, return error
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    console.log("password updated");
    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
