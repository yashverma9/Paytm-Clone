const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

function authMiddleware(req, res, next) {
    let authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "User not authenticated!" });
    }

    const token = authHeader.split(" ")[1];
    console.log("token:", token);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("decoded", decoded);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({ message: "User not authenticated!" });
    }
}

module.exports = authMiddleware;
