const express = require('express')
const router = express.Router()

const {Auth,AuthAdmin} = require('./Auth')

const dbHandler = require('./dbHandler')
const JWT = require('jsonwebtoken')
const {Op,where} = require("sequelize");


router.get("/workhoursGet", Auth(), async (req, res) => {
    return res.json(await dbHandler.workhours.findAll())
})

router.get("/workhoursMy", Auth(), async (req, res) => {
    try {
        const workhours = await dbHandler.workhours.findAll({
            where: {
                barberID: req.uid
            }
        });
        res.json(workhours);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Szerverhiba"
        });
    }
});

router.post("/workhoursPost", Auth(), async (req, res) => {
    const {
        dayOfWeek,
        start_time,
        end_time
    } = req.body

    if (!dayOfWeek || !start_time || !end_time) {
        return res.status(400).json({
            message: "Hiányzó adatok"
        });
    }

    try {
        const onewhour = await dbHandler.workhours.findOne({
            where: {
                barberID: req.uid,
                dayOfWeek: dayOfWeek,
                start_time: {
                    [Op.lt]: end_time
                },
                end_time: {
                    [Op.gt]: start_time
                }
            }
        })

        if (onewhour) {
            return res.status(400).json({
                message: "Már létező munkaidő"
            })
        }

        const workhours = await dbHandler.workhours.create({
            barberID: req.uid,
            dayOfWeek: dayOfWeek,
            start_time: start_time,
            end_time: end_time
        })

        return res.status(200).json({
            message: 'sikeres regisztracio',
            id: workhours.id
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Szerver hiba"
        })
    }
})

router.delete("/workhoursDelete/:id", Auth(), async (req, res) => {
    try {
        const Id = req.params.id
        const barberID = req.uid;

        if (isNaN(Id)) {
            return res.status(400).json({
                message: 'Invalid ID'
            });
        }

        const oneWorkhour = await dbHandler.workhours.findOne({
            where: {
                id: Id,
                barberID
            }
        });

        if (!oneWorkhour) {
            return res.status(404).json({
                message: "Nincs ilyen munkaidő"
            });
        }
        if (!barberID) {
            return res.status(401).json({
                message: "Hiányzó jogosultság"
            });
        }

        await dbHandler.workhours.destroy({
            where: {
                id: Id,
                barberID
            }
        });
        return res.status(200).json({
            message: "Sikeres törlés"
        });

    } catch (error) {
        console.log("asdads", error.message);
        res.status(500).json({
            message: "Szerverhiba"
        });
    }
});

router.put('/workhoursUpdate/:id', Auth(), async (req, res) => {

    try {
        const Id = req.params.id
        const id = req.uid

        if (isNaN(Id)) {
            return res.status(400).json({
                message: 'Invalid ID'
            });
        }

        const oneWorkhours = await dbHandler.workhours.findOne({
            where: {
                id: Id
            }
        });

        if (!oneWorkhours) {
            return res.status(404).json({
                message: "Nincs ilyen munkaóra"
            });
        }
        if (!id) {
            return res.status(401).json({
                message: "Hiányzó jogosultság"
            });
        }
        const {
            barberID,
            dayOfWeek,
            start_time,
            end_time
        } = req.body;
        if (!barberID && !dayOfWeek && !start_time && !end_time) {
            return res.status(400).json({
                message: "Nincs módosítandó adat"
            });
        }




        if (req.body.barberID) {
            await dbHandler.workhours.update({
                barberID: req.body.barberID
            }, {
                where: {
                    id: Id,
                    barberID: req.uid
                }
            })
        }

        if (req.body.dayOfWeek) {
            await dbHandler.workhours.update({
                dayOfWeek: req.body.dayOfWeek
            }, {
                where: {
                    id: Id,
                    barberID: req.uid
                }
            })
        }
        if (req.body.start_time) {
            await dbHandler.workhours.update({
                start_time: req.body.start_time
            }, {
                where: {
                    id: Id,
                    barberID: req.uid
                }
            })
        }
        if (req.body.end_time) {
            await dbHandler.workhours.update({
                end_time: req.body.end_time
            }, {
                where: {
                    id: Id,
                    barberID: req.uid
                }
            })
        }
        res.json({
            'message': 'sikeres módosítás'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Szerverhiba'
        });
    }


})

const SK = process.env.SECRET_KEY
const EI = process.env.EXPIRES_IN
module.exports = router