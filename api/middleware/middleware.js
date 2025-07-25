const jwt = require("jsonwebtoken");
const { personalAccessToken, User } = require("../models");

const middleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const fullToken = authHeader.split(" ")[1];
        const [token_id, jwtToken] = fullToken.split("|");

        if (!token_id || !jwtToken) {
            return res.status(400).json({ message: "Malformed token" });
        }

        // Find token by token_id
        const tokenRecord = await personalAccessToken.findOne({
            where: { token_id },
            include: { model: User, as: "user" },
        });

        if (!tokenRecord) {
            return res.status(401).json({ message: "Invalid token ID" });
        }

        // JWT verification with secret key
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

        if (decoded.id !== tokenRecord.userId) {
            return res.status(401).json({ message: "Token user mismatch" });
        }

        req.user = tokenRecord.user;
        next();
    } catch (err) {
        console.error("Middleware error:", err.message);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = middleware;
