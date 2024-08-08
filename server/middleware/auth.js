const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Received Token:', token);

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId, role: decoded.role };
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}

module.exports = auth;
