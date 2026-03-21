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
                { model: dbHandler.user, attributes: ['name', 'email','phoneNum'] },
                { model: dbHandler.services, attributes: ['name', 'price'] }
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
            },
            include: [
                { model: dbHandler.barber, attributes: ['name'] }, 
                { model: dbHandler.services, attributes: ['name'] } 
            ]
        });
        res.json(appointments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Szerverhiba" });
    }
});

// --- JAVÍTOTT: SZABAD IDŐPONT SZÁMÍTÁS (FIX 1 ÓRÁS FRONTEND SZINKRON) ---
router.get("/availableSlots/:barberID/:date", async (req, res) => {
    try {
        const { barberID, date } = req.params
        const jsDate = new Date(date)
        const dayIndex = jsDate.getDay()

        //Munkaido keresese
        const workhour = await dbHandler.workhours.findOne({
            where: {
                barberID,
                dayOfWeek: dayIndex
            }
        })

        if (!workhour) {
            return res.status(200).json([])
        }

        //Foglalasok lekerese (Booked és Completed is számít!)
        const appointments = await dbHandler.appointments.findAll({
            where: {
                barberID,
                status: { [Op.ne]: 'canceled' },
                start_time: {
                    [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`]
                }
            }
        })

        //Slotok generalasa
        const slots = []
        const toMin = (t) => {
            const [h, m] = t.split(':').map(Number)
            return h * 60 + m
        }

        let current = toMin(workhour.start_time.substring(0, 5))
        const end = toMin(workhour.end_time.substring(0, 5))

        while (current < end) {
            const h = Math.floor(current / 60).toString().padStart(2, '0')
            const m = (current % 60).toString().padStart(2, '0')
            const timeStr = `${h}:${m}`
            
            const slotStart = new Date(`${date} ${timeStr}:00`)
            // Mivel minden foglalás 1 órás a frontendben, itt is azzal számolunk:
            const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000)

            // Ütközés vizsgálat: a slot 1 órás sávja átfedi-e bármelyik létező foglalást
            const isBusy = appointments.some(a => {
                const aStart = new Date(a.start_time)
                const aEnd = new Date(a.end_time)
                // Átfedés ha: (KezdésA < VégeB) ÉS (VégeA > KezdésB)
                return slotStart < aEnd && slotEnd > aStart
            })

            if (!isBusy) {
                slots.push(slotStart)
            }
            current += 30
        }

        res.status(200).json(slots)
    } catch (error) {
        res.status(500).json({ message: "Szerverhiba" })
    }
})




router.post("/appointmentPost", Auth(), async(req,res)=>{
    const {serviceID, comment, start_time, end_time, userID} = req.body

    const oneAppointment = await dbHandler.appointments.findOne({
        
        where: {
                barberID: req.uid,
                start_time: { [Op.lt]: end_time },
                end_time: { [Op.gt]: start_time },
                status: { [Op.ne]: 'canceled' }
            }
    })
    if (!userID  || !serviceID || !start_time || !end_time || !comment) {
        return res.status(400).json({ message: "Missing fields" });
    }
    if(oneAppointment){
        return res.status(400).json({ message: "Ez a barber már foglalt az adott időintervallumban" });
    }
    try {
       const newAppointment = await dbHandler.appointments.create({
        barberID:req.uid,
        serviceID:serviceID,
        userID:userID,
        start_time:start_time,
        end_time:end_time,
        comment:comment
        
    })      
    return res.status(200).json({message: 'sikeres regisztracio', id:newAppointment.id}).end()
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})




router.post("/appointmentUserPost", Auth(), async (req, res) => {
    
    try {
        if (!req.body || typeof req.body !== "object") {
            return res.status(400).json({ message: "Invalid body" });
        }
        const { barberID, serviceID, start_time, end_time, comment } = req.body
        const userID = req.uid
        if (!barberID || !serviceID || !start_time || !end_time || !comment) {
            return res.status(400).json({ message: "Missing data" });
        }
        if (typeof barberID !== "number" || typeof serviceID !== "number") {
            return res.status(400).json({ message: "Invalid IDs" });
        }
        if (isNaN(new Date(start_time)) || isNaN(new Date(end_time))) {
            return res.status(400).json({ message: "Invalid date format" });
        }
        const existingAppointment = await dbHandler.appointments.findOne({
            where: {
                barberID: barberID,
                start_time: { [Op.lt]: end_time },
                end_time: { [Op.gt]: start_time },
                status: { [Op.ne]: 'canceled' }
            }
        })
        
        if (existingAppointment) {
            return res.status(400).json({
                message: "Ez az időpont már foglalt ennél a fodrásznál"
            })
        }
        const newAppointment = await dbHandler.appointments.create({
            barberID: barberID,
            serviceID: serviceID,
            userID: userID,
            start_time: start_time, 
            end_time: end_time, 
            comment: comment,
            status: "booked"
        })
        res.status(200).json({
            message: "Foglalás sikeres",
            id:newAppointment.id
        })
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            message: "Szerver hiba"
        })
    }
})
function ValidateId() {
    return (req, res, next) => {
        const rawId = req.params.id;
        if (isNaN(rawId)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        next();
    }
}

router.delete("/appointmentDelete/:id", Auth(), ValidateId(),Log(), async (req, res) => {
    try {
        const uid = req.uid;
        const Id = req.params.id
        

        const appointment = await dbHandler.appointments.findOne({ where: { id: Id} });
        if (!appointment) {
            return res.status(404).send("Időpont nem található");
        }

        if (!uid) return res.status(401).json({ message: 'No token' });

         if (appointment.barberID === uid) {
            await dbHandler.appointments.destroy({ where: { id: Id } });
            return res.status(200).send("Időpont teljesen törölve a barber által");
        }



         if (appointment.userID === uid) {
            
            await appointment.update({
                status: "canceled",

            });

            return res.status(200).send("Időpont lemondva, újra foglalható");
        }
        return res.status(401).send("Nincs jogosultságod lemondani ezt az időpontot");
        
        
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

   return res.status(200).send("Időpont sikeresen lefoglalva")
})

router.put('/appointmentUpdate/:id', Auth(), ValidateId(), async (req, res) => {
    try {
        const Id = req.params.id;
        const barberID = req.uid;

        // frissiteni valo mezok
        const updateFields = {};
        const { userID, start_time, end_time, status, comment } = req.body;
        

        if (userID !== undefined) updateFields.userID = userID;
        if (start_time !== undefined) updateFields.start_time = start_time;
        if (end_time !== undefined) updateFields.end_time = end_time;
        if (status !== undefined) updateFields.status = status;
        if (comment !== undefined) updateFields.comment = comment;

        // megnezi mik valtoztak
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: 'Nincs frissítendő adat' });
        }

        // megkeresi az idopontot
        const oneAppointment = await dbHandler.appointments.findOne({ where: { id: Id, barberID }});
        if (!oneAppointment) {
            return res.status(404).json({ message: "Időpont nem található vagy nincs hozzá jogosultságod" });
        }

        if (start_time && end_time) {
            const conflictingAppointment = await dbHandler.appointments.findOne({
                where: {
                    barberID,
                    start_time: { [Op.lt]: end_time },
                    end_time: { [Op.gt]: start_time },
                    id: { [Op.ne]: Id },
                    status: { [Op.ne]: 'canceled' }
                }
            });

            if (conflictingAppointment) {
                return res.status(400).json({ message: "Ez a barber már foglalt az adott időintervallumban" });
            }
        }

        await dbHandler.appointments.update(updateFields, {
            where: { id: Id, barberID }
        });

        return res.json({ message: 'Sikeres módosítás' });

    } catch (error) {
        console.error("Hiba az időpont frissítésekor:", error);
        return res.status(500).json({ message: 'Szerverhiba' });
    }
});


const SK=process.env.SECRET_KEY
const EI=process.env.EXPIRES_IN 
module.exports = router