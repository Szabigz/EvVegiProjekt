const express = require('express')
const router=express.Router()

const Auth=require('./Auth')
 
const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')

const SK=process.env.SECRET_KEY
const EI=process.env.EXPIRES_IN 

router.post("/barber", Auth(), async(req,res)=>{
    const { name} = req.body
    const oneBarber = await dbHandler.barber.findOne({
        where:{
            name:name
        }
        
    })
    if(oneBarber){
        return res.status(400).json({message:"Mar van ilyen"})
    }
    
    await dbHandler.barber.create({
        name:name,
        
    })
    res.status(200).json({message: 'sikeres regisztracio'}).end()

})




module.exports = router