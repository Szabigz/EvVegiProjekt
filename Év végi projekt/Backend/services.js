const express = require('express')
const router=express.Router()

const Auth=require('./Auth')
 
const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')

router.post("/service", async(req,res)=>{
    const {description, name, duration_minutes,price,barberID} = req.body
    const oneUser = await dbHandler.services.findOne({
        where:{
            name:name,
        }
        
    })
    if(oneUser){
        return res.status(400).json({message:"Mar van ilyen"})
    }
    
    await dbHandler.services.create({
        name:name,
        description:description,
        duration_minutes:duration_minutes,
        price:price,
        barberID:barberID
    })
    res.status(200).json({message: 'sikeres regisztracio'}).end()

})


const SK=process.env.SECRET_KEY
const EI=process.env.EXPIRES_IN 
module.exports = router