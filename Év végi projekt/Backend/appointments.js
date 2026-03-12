const express = require('express')
const router=express.Router()
const { Op } = require("sequelize");
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
        where: {
                barberID: barberID,
                start_time: { [Op.lt]: end_time },
                end_time: { [Op.gt]: start_time }
            }
    })
    if(oneBarber){
        return res.status(400).json({ message: "Ez a barber már foglalt az adott időintervallumban" });
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


router.delete("/appointmentDelete/:id", Auth(), Log(), async (req, res) => {
    await dbHandler.appointments.update(
        { status: "canceled" },
        { where: { id: req.params.id } }
    );
    res.send("Időpont lemondva");
  });


router.put('/appointmentUpdate/:id', Auth(), async(req,res) =>{

    try {
        const Id = req.params.id
        const id = req.uid
        const oneAppointment = await dbHandler.appointments.findOne({ where: { id:Id } });

        if (!oneAppointment) {
            return res.status(400).json({ message: "Nincs ilyen felhasználó" });
        }
        if(!id){
        return res.status(400).json({'message': 'Hiányzó Tool ID'})
    }

    if(req.body.userID){
        await dbHandler.appointments.update({
            userID:req.body.userID
        },{
            where:{
                id:Id
            }
        })
    }

    if(req.body.barberID){
        await dbHandler.appointments.update({
            barberID:req.body.barberID
        },{
            where:{
                id:Id
            }
        })
    }

    if(req.body.start_time){
        await dbHandler.appointments.update({
            start_time:req.body.start_time
        },{
            where:{
                id:Id
            }
        })
    }
    if(req.body.end_time){
        await dbHandler.appointments.update({
            end_time:req.body.end_time
        },{
            where:{
                id:Id
            }
        })
    }
    if(req.body.status){
        await dbHandler.appointments.update({
            status:req.body.status
        },{
            where:{
                id:Id
            }
        })
    }
    if(req.body.comment){
        await dbHandler.appointments.update({
            comment:req.body.comment
        },{
            where:{
                id:Id
            }
        })
    }
    res.json({'message':'sikeres módosítás'})
    } catch (error) {
        console.log(error);
    return res.status(500).json({ message: 'Szerverhiba' });
    }
    

})


const SK=process.env.SECRET_KEY
const EI=process.env.EXPIRES_IN 
module.exports = router