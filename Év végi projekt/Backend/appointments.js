const express = require('express')
const router=express.Router()
const { Op, where } = require("sequelize");
const Auth=require('./Auth')
const Log = require('./log') 

const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')



router.get("/appointmentMyBarber", Auth(), async (req, res) => {
    try {
        const appointments = await dbHandler.appointments.findAll({
            where: { barberID: req.uid },
            include: [
                { model: dbHandler.user, attributes: ['name'] },
                { model: dbHandler.services, attributes: ['name'] }
            ]
        });
        res.json(appointments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Szerverhiba" });
    }
});

router.get("/appointmentMyUser", Auth(), async (req, res) => {
    const userID=req.uid
    try {
        const appointments = await dbHandler.appointments.findAll({
            where: {
                userID: userID,
                status: "booked"
            }
        });
        res.json(appointments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Szerverhiba" });
    }
});

router.post("/appointmentPost", Auth(), async(req,res)=>{
    const {serviceID, comment, start_time, end_time} = req.body
    const oneAppointment = await dbHandler.appointments.findOne({
        where: {
                barberID: req.uid,
                start_time: { [Op.lt]: end_time },
                end_time: { [Op.gt]: start_time }
            }
    })
    if(oneAppointment){
        return res.status(400).json({ message: "Ez a barber már foglalt az adott időintervallumban" });
    }
    try {
         await dbHandler.appointments.create({
        barberID:req.uid,
        serviceID:serviceID,
        userID:null,
        start_time:start_time,
        end_time:end_time,
        comment:comment
        
    })
    res.status(200).json({message: 'sikeres regisztracio'}).end()
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.post("/appoointmentUserPost", Auth(), async (req, res) => {

    const { barberID, serviceID, start_time, end_time, comment } = req.body
    const userID = req.uid

    try {

        const existingAppointment = await dbHandler.appointments.findOne({
            where: {
                barberID: barberID,
                start_time: { [Op.lt]: end_time },
                end_time: { [Op.gt]: start_time }
            }
        })

        if (existingAppointment) {
            return res.status(400).json({
                message: "Ez az időpont már foglalt ennél a fodrásznál"
            })
        }

        await dbHandler.appointments.create({
            barberID: barberID,
            serviceID: serviceID,
            userID: userID,
            start_time: start_time,
            end_time: end_time,
            comment: comment,
            status: "booked"
        })

        res.status(200).json({
            message: "Foglalás sikeres"
        })

    }
    catch (error) {

        console.log(error)

        res.status(500).json({
            message: "Szerver hiba"
        })

    }

})


router.delete("/appointmentDelete/:id", Auth(), Log(), async (req, res) => {
    const Id = req.params.id;
    const uid = req.uid;
    try {
        const appointment = await dbHandler.appointments.findOne({ where: { id: Id} });

        if (!appointment) {
            return res.status(404).send("Időpont nem található");
        }
         if (appointment.barberID === uid) {
            await dbHandler.appointments.destroy({ where: { id: Id } });
            return res.status(200).send("Időpont teljesen törölve a barber által");
        }
         if (appointment.userID === uid) {
            
            await appointment.update({
                status: "available",
                userID: null
            });

            return res.status(200).send("Időpont lemondva, újra foglalható");
        }
        return res.status(403).send("Nincs jogosultságod lemondani ezt az időpontot");


        
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
            status: "booked",
            userID :req.uid
        },
        { where: { id: Id } }
    )

    res.status(200).send("Időpont sikeresen lefoglalva")
})


router.put('/appointmentUpdate/:id', Auth(), async(req,res) =>{

    try {
        const Id = req.params.id
        const barberID = req.uid
        const oneAppointment = await dbHandler.appointments.findOne({ where: { id:Id, barberID  } });

        if (!oneAppointment) {
            return res.status(400).json({ message: "Nincs ilyen felhasználó" });
        }
       

    if(req.body.userID){
        await dbHandler.appointments.update({
            userID:req.body.userID
        },{
            where:{
                id:Id, barberID
            }
        })
    }

    if(req.body.barberID){
        await dbHandler.appointments.update({
            barberID:req.body.barberID
        },{
            where:{
                id:Id, barberID
            }
        })
    }

    if(req.body.start_time){
        await dbHandler.appointments.update({
            start_time:req.body.start_time
        },{
            where:{
                id:Id, barberID
            }
        })
    }
    if(req.body.end_time){
        await dbHandler.appointments.update({
            end_time:req.body.end_time
        },{
            where:{
                id:Id, barberID
            }
        })
    }
    if(req.body.status){
        await dbHandler.appointments.update({
            status:req.body.status
        },{
            where:{
                id:Id, barberID
            }
        })
    }
    if(req.body.comment){
        await dbHandler.appointments.update({
            comment:req.body.comment
        },{
            where:{
                id:Id, barberID
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