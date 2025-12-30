const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.token; // 👈 read from cookie

  if (!token) {
    return res.status(401).json({ message: "Access denied. Not logged in." });
  }

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
