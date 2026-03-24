const express = require('express')
const router = express.Router()
const { Op} = require("sequelize")
const {Auth, AuthAdmin} = require('./Auth')
const Log = require('./log')
const dbHandler = require('./dbHandler')
const {
    sendBookingEmail
} = require('./emailsender');

router.get("/appointmentMyBarber", Auth(), async (req, res) => {
    try {
        const appointments = await dbHandler.appointments.findAll({
            where: {
                barberID: req.uid
            },
            include: [{
                    model: dbHandler.user,
                    attributes: ['name', 'email', 'phoneNum']
                },
                {
                    model: dbHandler.services,
                    attributes: ['name', 'price']
                }
            ]
        })
        res.json(appointments)
    } catch (error) {
        res.status(500).json({
            message: "Szerverhiba"
        })
    }
})

router.get("/appointmentMyUser", Auth(), async (req, res) => {
    try {
        const appointments = await dbHandler.appointments.findAll({
            where: {
                userID: req.uid,
                status: "booked"
            },
            include: [{
                model: dbHandler.barber,
                attributes: ['name']
            }, {
                model: dbHandler.services,
                attributes: ['name']
            }]
        })
        res.json(appointments)
    } catch (error) {
        res.status(500).json({
            message: "Szerverhiba"
        })
    }
})

router.get("/availableSlots/:barberID/:date", async (req, res) => {
    try {
        const {
            barberID,
            date
        } = req.params
        if (isNaN(new Date(date))) return res.status(400).json({
            message: "Invalid date"
        })
        const jsDate = new Date(date)
        const dayIndex = jsDate.getDay()

        const workhour = await dbHandler.workhours.findOne({
            where: {
                barberID,
                dayOfWeek: dayIndex
            }
        })
        if (!workhour) return res.status(200).json([])

        const appointments = await dbHandler.appointments.findAll({
            where: {
                barberID,
                status: {
                    [Op.ne]: 'canceled'
                },
                start_time: {
                    [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`]
                }
            }
        })

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
            const slotStart = new Date(`${date} ${h}:${m}:00`)
            const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000)

            const isBusy = appointments.some(a => {
                const aStart = new Date(a.start_time)
                const aEnd = new Date(a.end_time)
                return slotStart < aEnd && slotEnd > aStart
            })

            if (!isBusy) slots.push(slotStart)
            current += 30
        }
        res.status(200).json(slots)
    } catch (error) {
        res.status(500).json({
            message: "Szerverhiba"
        })
    }
})

router.post("/appointmentPost", Auth(), async (req, res) => {
    const {
        serviceID,
        comment,
        start_time,
        end_time,
        userID
    } = req.body
    if (!userID || !serviceID || !start_time || !end_time || !comment) {
        return res.status(400).json({
            message: "Missing data"
        })
    }

    const oneAppointment = await dbHandler.appointments.findOne({
        where: {
            barberID: req.uid,
            start_time: {
                [Op.lt]: end_time
            },
            end_time: {
                [Op.gt]: start_time
            },
            status: {
                [Op.ne]: 'canceled'
            }
        }
    })
    if (oneAppointment) return res.status(400).json({
        message: "Ez a barber már foglalt az adott időintervallumban"
    })

    try {
        const newAppointment = await dbHandler.appointments.create({
            barberID: req.uid,
            serviceID,
            userID,
            start_time,
            end_time,
            comment
        })
        res.status(200).json({
            message: 'sikeres regisztracio',
            id: newAppointment.id
        })
    } catch (error) {
        res.status(500).json(error)
    }
})

router.post("/appointmentUserPost", Auth(), async (req, res) => {
    try {
        const {
            barberID,
            serviceID,
            start_time,
            end_time,
            comment
        } = req.body
        if (!barberID || !serviceID || !start_time || !end_time || !comment) return res.status(400).json({
            message: "Missing data"
        })
        if (isNaN(parseInt(barberID)) || isNaN(parseInt(serviceID))) return res.status(400).json({
            message: "Invalid IDs"
        })
        if (isNaN(new Date(start_time)) || isNaN(new Date(end_time))) return res.status(400).json({
            message: "Invalid date format"
        })



        const existingAppointment = await dbHandler.appointments.findOne({
            where: {
                barberID,
                start_time: {
                    [Op.lt]: end_time
                },
                end_time: {
                    [Op.gt]: start_time
                },
                status: {
                    [Op.ne]: 'canceled'
                }
            }
        })
        if (existingAppointment) return res.status(400).json({
            message: "Ez az időpont már foglalt"
        })

        const newAppointment = await dbHandler.appointments.create({
            barberID: parseInt(barberID),
            serviceID: parseInt(serviceID),
            userID: req.uid,
            start_time,
            end_time,
            comment,
            status: "booked"
        })
        const barber = await dbHandler.barber.findByPk(barberID)
        const service = await dbHandler.services.findByPk(serviceID)
        const user = await dbHandler.user.findByPk(req.uid)
        if (user && user.email) {
            const dateObj = new Date(start_time);
            const formattedDate = dateObj.toLocaleDateString("hu-HU");
            const formattedTime = dateObj.toLocaleTimeString("hu-HU", {
                hour: "2-digit",
                minute: "2-digit"
            });

            sendBookingEmail(
                user.email,
                barber.name,
                service.name,
                formattedDate,
                formattedTime
            ).catch(err => console.error("Email hiba:", err));
        }

        res.status(200).json({
            message: "Foglalás sikeres",
            id: newAppointment.id
        })
    } catch (error) {
        res.status(500).json({
            message: "Szerver hiba"
        })
    }
})

function ValidateId() {
    return (req, res, next) => {
        if (isNaN(req.params.id)) return res.status(400).json({
            message: "Invalid ID"
        })
        next()
    }
}

router.delete("/appointmentDelete/:id", Auth(), ValidateId(), Log(), async (req, res) => {
    try {
        const appointment = await dbHandler.appointments.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!appointment) return res.status(404).send("Időpont nem található")

        if (appointment.barberID === req.uid) {
            await dbHandler.appointments.destroy({
                where: {
                    id: req.params.id
                }
            })
            return res.status(200).send("Időpont törölve")
        }
        if (appointment.userID === req.uid) {
            await appointment.update({
                status: "canceled"
            })
            return res.status(200).send("Időpont lemondva")
        }
        return res.status(401).send("No token")
    } catch (err) {
        res.status(500).send("Hiba")
    }
})

router.put('/appointmentUpdate/:id', Auth(), ValidateId(), Log(), async (req, res) => {
    const {serviceID, start_time, end_time, comment, status} = req.body
    if (!serviceID && !start_time && !end_time && !comment && !status) {
        return res.status(400).json({
            message: "Nincs módosítandó adat"
        })
    }
    try {
        const oneAppointment = await dbHandler.appointments.findOne({
            where: {
                id: req.params.id,
                barberID: req.uid
            }
        })
        if (!oneAppointment) return res.status(404).json({
            message: "Időpont nem található"
        })
        

        const {
            start_time,
            end_time
        } = req.body
        if (start_time && end_time) {
            const conflict = await dbHandler.appointments.findOne({
                where: {
                    barberID: req.uid,
                    start_time: {
                        [Op.lt]: end_time
                    },
                    end_time: {
                        [Op.gt]: start_time
                    },
                    id: {
                        [Op.ne]: req.params.id
                    },
                    status: {
                        [Op.ne]: 'canceled'
                    }
                }
            })
            if (conflict) return res.status(400).json({
                message: "Ez a barber már foglalt"
            })
        }

        await dbHandler.appointments.update(req.body, {
            where: {
                id: req.params.id,
                barberID: req.uid
            }
        })
        res.json({
            message: 'Sikeres módosítás'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Szerverhiba'
        })
    }
})

module.exports = router