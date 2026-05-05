const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  
  if (!authHeader) {
    console.log("No token provided")
    return res.status(401).json({ message: "No token provided" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    console.log("Invalid token format");
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;