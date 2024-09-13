import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    console.log('Auth middleware hit');
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        req.user = { id: decoded.userId };
        next();
    } catch (err) {
        console.log('Token verification failed:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default auth;