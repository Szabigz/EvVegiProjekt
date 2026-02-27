const JWT = require("jsonwebtoken")
require('dotenv').config()
const SK = process.env.SECRET_KEY

function Auth() {
    return (req, res, next) => {
        const header = req.headers['authorization'];
        console.log("Authorization header:", req.headers['authorization']);
        if (!header) return res.status(401).json({ message: "No authorization header" });

        const [scheme, token] = header.split(' ');
        if (scheme !== 'Bearer' || !token) return res.status(401).json({ message: "Invalid authorization format" });

        try {
            const decodedToken = JWT.verify(token, SK);
            console.log("Decoded token:", decodedToken);
            req.uid = decodedToken.uid;
            next();
        } catch (error) {
            console.log("JWT verify failed:", error.message);
            res.status(401).json({ message: "Invalid token" });
        }
    };
}
module.exports = Auth