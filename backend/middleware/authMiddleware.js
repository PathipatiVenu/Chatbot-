const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from the header (Bearer <token>)
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // This adds the user's ID to the 'req' object
    next(); // Move to the actual controller logic
  } catch (err) {
    res.status(400).json({ message: "Invalid or Expired Token" });
  }
};