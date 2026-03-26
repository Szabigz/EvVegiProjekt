const JWT = require("jsonwebtoken")
require('dotenv').config()
const SK = process.env.SECRET_KEY
const dbHandler = require('./dbHandler')

function verifyToken(req) {
    const header = req.headers['authorization']
    if (!header) throw new Error("No authorization header")
    const [scheme, token] = header.split(' ')
    if (scheme !== 'Bearer' || !token) throw new Error("Invalid format")
    return JWT.verify(token, SK)
}

function Auth() {
    return (req, res, next) => {
        try {
            const decoded = verifyToken(req)
            req.uid = decoded.uid
            req.role = decoded.role
            next()
        } catch (error) {
            res.status(401).json({
                message: "Invalid token"
            })
        }
    }
}

function AuthBarber() {
    return (req, res, next) => {
        try {
            const decoded = verifyToken(req)
            if (decoded.role !== 'barber') return res.status(403).json({
                message: "Barber access required"
            })
            req.uid = decoded.uid
            req.role = decoded.role
            next()
        } catch (error) {
            res.status(401).json({
                message: "Invalid token"
            })
        }
    }
}

function AuthUser() {
    return (req, res, next) => {
        try {
            const decoded = verifyToken(req)
            if (decoded.role !== 'user') return res.status(403).json({
                message: "User access required"
            })
            req.uid = decoded.uid
            req.role = decoded.role
            next()
        } catch (error) {
            res.status(401).json({
                message: "Invalid token"
            })
        }
    }
}

function AuthAdmin() {
    return async (req, res, next) => {
        try {
            const decoded = verifyToken(req)

            if (decoded.role !== 'barber') return res.status(403).json({
                message: "Admin access required"
            })

            const barber = await dbHandler.barber.findByPk(decoded.uid)
            if (barber && barber.isAdmin) {
                req.uid = decoded.uid
                req.role = decoded.role
                next()
            } else {
                res.status(403).json({
                    message: "Admin access required"
                })
            }
        } catch (error) {
            res.status(401).json({
                message: "Invalid token"
            })
        }
    }
}

module.exports = {
    Auth,
    AuthUser,
    AuthBarber,
    AuthAdmin
}