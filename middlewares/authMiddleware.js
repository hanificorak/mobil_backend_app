const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Token gerekli." });
  }

  // "Bearer abcdef..." -> "abcdef..."
  const pureToken = token.startsWith("Bearer ") ? token.slice(7) : token;

  try {
    const decoded = jwt.verify(pureToken, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error("JWT Doğrulama Hatası:", err.message);
    return res.status(401).json({ message: "Geçersiz veya süresi dolmuş token." });
  }
};
