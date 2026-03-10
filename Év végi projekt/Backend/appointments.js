const express = require('express')
const router=express.Router()
const { Op, where } = require("sequelize");
const Auth=require('./Auth')
const Log = require('./log') 

const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')



router.get("/appointmentGet",Auth(), async(req,res)=>{
    return res.json(await dbHandler.appointments.findAll())
})



router.post("/appointmentPost", Auth(), async(req,res)=>{
    const { barberID, serviceID, userID, comment, start_time, end_time} = req.body
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
        start_time:start_time,
        end_time:end_time,
        comment:comment
        
    })
    res.status(200).json({message: 'sikeres regisztracio'}).end()

})


router.delete("/appointmentDelete/:id", Auth(), Log(), async (req, res) => {
    const Id = req.params.id;

    try {
        // Megkeressük az időpontot
        const appointment = await dbHandler.appointments.findOne({ where: { id: Id } });

        if (!appointment) {
            return res.status(404).send("Időpont nem található");
        }
        // Időpont státusz visszaállítása available-re
        await dbHandler.appointments.update(
            { status: "available", }, // userID null, így újra foglalható
            { where: { id: Id } }
        );

        return res.status(200).send("Időpont lemondva, de elérhető másoknak");
    } catch (err) {
        console.error("Hiba a lemondás közben:", err);
        return res.status(500).send("Hiba történt a lemondás során");
    }
});

router.put("/appointmentBook/:id", Auth(), async (req, res) => {

    const Id = req.params.id

    const appointment = await dbHandler.appointments.findOne({
        where: { id: Id }
    })

    if (!appointment) {
        return res.status(404).send("Időpont nem található")
    }

    if (appointment.status !== "available") {
        return res.status(400).send("Az időpont már foglalt")
    }

    await dbHandler.appointments.update(
        { 
            status: "booked"
        },
        { where: { id: Id } }
    )

    res.status(200).send("Időpont sikeresen lefoglalva")
})


router.put('/appointmentUpdate/:id', Auth(), async(req,res) =>{

    try {
        const Id = req.params.id
        const id = req.uid
        const oneAppointment = await dbHandler.appointments.findOne({ where: { id:Id } });

        if (!oneAppointment) {
            return res.status(400).json({ message: "Nincs ilyen felhasználó" });
        }
        if(!id){
        return res.status(400).json({'message': 'Hiányzó  ID'})
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