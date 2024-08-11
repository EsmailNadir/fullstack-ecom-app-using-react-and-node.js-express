const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// Ensure this is the correct import

const router = express.Router();

// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Invalid email"); // Debugging statement
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid password"); // Debugging statement
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token that includes the user ID
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Debugging statements
    console.log("Response:", { token, userId: user._id });

    // Send the token and userId in the response
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// User signup
router.post("/signup", (req, res) => {
  const { username, email, password, role } = req.body;

  console.log(password);

  // Basic validation
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required." });
  }

  // Check if the user already exists
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      // Create a new user with the raw password
      const newUser = new User({
        username,
        email,
        password, // Pass the raw password here
        role,
      });

      // Save the user to the database
      return newUser.save();
    })
    .then(() => {
      // Respond with success message
      res.status(201).json({ message: "User created successfully." });
    })
    .catch((err) => {
      console.error("Signup error:", err.message);
      res.status(500).json({ message: "Server error." });
    });
});

module.exports = router;
