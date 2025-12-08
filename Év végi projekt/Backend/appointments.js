const express = require('express')
const router=express.Router()

const Auth=require('./Auth')
 
const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')


router.post("/appointment", Auth(), async(req,res)=>{
    const { appointment, barberID, serviceID, userID, status, comment} = req.body
    const oneBarber = await dbHandler.appointments.findOne({
        where:{
            appointment:appointment
        }
        
    })
    if(oneBarber){
        return res.status(400).json({message:"Mar van ilyen"})
    }
    
    await dbHandler.appointments.create({
        appointment:appointment,
        barberID:barberID,
        serviceID:serviceID,
        userID:userID,
        status:status,
        comment:comment
        
    })
    res.status(200).json({message: 'sikeres regisztracio'}).end()

})


const SK=process.env.SECRET_KEY
const EI=process.env.EXPIRES_IN 
module.exports = router