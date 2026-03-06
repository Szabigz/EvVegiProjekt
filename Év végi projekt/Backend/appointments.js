const express = require('express')
const router=express.Router()

const Auth=require('./Auth')
const Log = require('./log') 

const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')



router.get("/appointmentGet",Auth(), async(req,res)=>{
    return res.json(await dbHandler.appointments.findAll())
})



router.post("/appointmentPost", Auth(), async(req,res)=>{
    const { barberID, serviceID, userID, status, comment, start_time, end_time} = req.body
    const oneBarber = await dbHandler.appointments.findOne({
        where:{
            status:status
        }
        
    })
    if(oneBarber){
        return res.status(400).json({message:"Mar van ilyen"})
    }
    
    await dbHandler.appointments.create({
        barberID:barberID,
        serviceID:serviceID,
        userID:userID,
        status:status,
        start_time:start_time,
        end_time:end_time,
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