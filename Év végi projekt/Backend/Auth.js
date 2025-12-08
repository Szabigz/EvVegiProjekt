const JWT = require("jsonwebtoken")
require('dotenv').config()
const SK = process.env.SECRET_KEY

function Auth(){
    return (req,res,next)=>{
        try {
            const header = req.headers.authorization

        const decodedToken = JWT.verify(header, SK)

        req.uid = decodedToken.uid
        next()
        } catch (error) {
            console.error()
            return res.status(400).json({message:"sikeretelen hitelesites"}).end()
        }
        
    }
}
module.exports = Auth