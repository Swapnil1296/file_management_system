const jwt = require("jsonwebtoken");

// Middleware function for token validation
const verifyToken = (req, res, next) => {
  // Extract token from the Authorization header
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No token provided", status: 401 });
  }

  // Extract token from the Authorization header
  const token = authHeader.split(" ")[1];

  try {
    // Validate token using JWT library
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your_secret_key' with your actual secret key

    // If token is valid, you can optionally attach the decoded token to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If token is invalid or expired, return a 401 Unauthorized response
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid token", status: 401 });
  }
};

module.exports = verifyToken;
