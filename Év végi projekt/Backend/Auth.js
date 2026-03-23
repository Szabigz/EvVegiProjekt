const JWT = require("jsonwebtoken")
require('dotenv').config()
const SK = process.env.SECRET_KEY
const dbHandler = require('./dbHandler')

function Auth() {
    return (req, res, next) => {
        const header = req.headers['authorization'];
        if (!header) return res.status(401).json({ message: "No authorization header" });

        const [scheme, token] = header.split(' ');
        if (scheme !== 'Bearer' || !token) return res.status(401).json({ message: "Invalid authorization format" });

        try {
            const decodedToken = JWT.verify(token, SK);
            req.uid = decodedToken.uid;
            next();
        } catch (error) {
            res.status(401).json({ message: "Invalid token" });
        }
    };
}

function AuthAdmin() {
    return async (req, res, next) => {
        const header = req.headers['authorization'];
        if (!header) return res.status(401).json({ message: "No authorization" });

        const [scheme, token] = header.split(' ');

        try {
            const decodedToken = JWT.verify(token, SK);
            const barber = await dbHandler.barber.findByPk(decodedToken.uid);

            if (barber && barber.isAdmin) {
                req.uid = decodedToken.uid;
                next();
            } else {
                res.status(403).json({ message: "Admin access required" });
            }

        } catch (error) {
            res.status(401).json({ message: "Invalid token" });
        }
    };
}

module.exports = { Auth, AuthAdmin }