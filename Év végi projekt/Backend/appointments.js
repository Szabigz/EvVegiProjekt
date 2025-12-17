const express = require('express')
const router=express.Router()

const Auth=require('./Auth')
const Log = require('./log') 

const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')


router.get("/appointent",Auth(), async(req,res)=>{
    res.json(await dbHandler.appointments.findOne({where:{id:req.uid}}))
})


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


router.delete("/appointment/:id", Auth(), Log(), async (req, res) => {
    await dbHandler.appointments.update(
        { status: "canceled" },
        { where: { id: req.params.id } }
    );
    res.send("Időpont lemondva");
  });


  router.put('/appointments', Auth(), async (req,res) =>{
    if(!req.body.name){
        return res.status(400).json({'message':'nem jo'})
    }

    if(req.body.uid){
        await dbHandler.appointments.update({
            appointment:req.body.appointment
        },{
            where:{
                id:req.body.uid
            }
        })
    }


    res.json({'message':'sikeres módosítás'})

})


const SK=process.env.SECRET_KEY
const EI=process.env.EXPIRES_IN 
module.exports = router