const bypassAdminCheck = false; // Set to false to enable admin check

const admin = async (req, res, next) => {
    console.log('Admin middleware reached');
  if (bypassAdminCheck) {
    console.log('Bypassing admin check');
    return next(); // Bypass the admin check
  }
  console.log('Checking user role');
  if (req.user.role === 'admin') {
    next(); // Allow admin access
  } else {
    console.log('User is not admin, denying access');
    return res.status(403).json({ message: 'Access denied' });
  }
};

export default admin;