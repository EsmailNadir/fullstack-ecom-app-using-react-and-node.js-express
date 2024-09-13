import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    try {
        let user = await User.findOne({ email });
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('User not found');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('Stored hashed password:', user.password);
        console.log('Provided password:', password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch ? 'Yes' : 'No');

        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Login successful, token generated');
        res.json({ token, userId: user._id });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
// User signup
router.post('/signup', async (req, res) => {
    console.log('Signup route hit', req.body);
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        console.log('Existing user found:', user ? 'Yes' : 'No');

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ username, email, password });
        
        console.log('New user object created:', user);

        await user.save();
        console.log('User saved to database');

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token generated:', token);

        res.status(201).json({ token, userId: user._id });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get user profile
router.get('/me', auth, async (req, res) => {
    console.log('GET /me route hit');
    console.log('User from token:', req.user);
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error in GET /me route:', err.message);
        res.status(500).send('Server Error');
    }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
    try {
        const { username, email, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update username and email if provided
        if (username) user.username = username;
        if (email) user.email = email;

        // If changing password
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            user.password = await bcrypt.hash(newPassword, 10);
            console.log('New password hash:', user.password);
        }

        await user.save();
        console.log('User saved successfully');

        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Error updating profile:', err.message);
        res.status(500).json({ message: 'Server Error: ' + err.message });
    }
});
export default router
