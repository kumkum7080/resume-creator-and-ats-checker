const jwt = require("jsonwebtoken");

module.exports = function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized. Missing authorization token." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "spectra_jwt_secret_token_change_in_production");
    
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ error: "Unauthorized. Invalid or expired token." });
  }
};
