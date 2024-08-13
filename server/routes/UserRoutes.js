import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';  // Ensure this is the correct import

const router = express.Router();

// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Invalid email');  // Debugging statement
            return res.status(400).json({ message: 'Invalid credentials' });
            console.log(req.body);
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

export default router;
