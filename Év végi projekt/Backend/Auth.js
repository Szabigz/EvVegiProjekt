const JWT = require("jsonwebtoken")
require('dotenv').config()
const SK = process.env.SECRET_KEY

function Auth(){
    return(req,res,next)=>{
        const header = req.headers['authorization'];
        console.log("Kapott header: ", header)
        try{
            const pieces = header.split(' ').length
            if(pieces == 2){
                header = header.split(' ')[1]
                
                    const decodedToken = JWT.verify(header, SK)
                    req.uid = decodedToken.userID
                    next()
            }
        }
        catch(error){
            console.log(error)
            res.status(400).json({Message:error}.end())
        }
    }
}
module.exports = Auth