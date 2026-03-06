const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  console.log("AUTH HEADER:", header);
  if (!header) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const token = header && header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    console.log("DECODED:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("TOKEN ERROR:", err.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
}



module.exports = verifyToken;

