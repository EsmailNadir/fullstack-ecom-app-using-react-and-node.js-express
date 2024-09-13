import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findOne } from '../models/User';
import { useRoutes } from 'react-router-dom';
import auth from '../middleware/auth';
const router = express.Router();

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        console.log('Fetched user:', user);  // Debugging statement
        console.log('User ID:', user._id);  // Debugging statement

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: 'Infinity' });
        
        console.log('Token:', token);  // Debugging statement
        console.log('Response:', { token, userId: user._id });  

        res.json({ token, userId: user._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
