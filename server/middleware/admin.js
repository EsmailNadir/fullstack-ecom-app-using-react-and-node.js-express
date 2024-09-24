const bypassAdminCheck = false; // Set to true to bypass admin check for testing purposes

const admin = async (req, res, next) => {
  if (bypassAdminCheck) {
    return next(); // Bypass the admin check
  }

  if (req.user.role === 'admin') {
    return next(); // Allow admin access
  } else {
    return res.status(403).json({ message: 'Access denied' });
  }
};

export default admin;
