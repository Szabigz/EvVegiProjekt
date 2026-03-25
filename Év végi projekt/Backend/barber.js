const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")
const {
    Op
} = require("sequelize")
const {
    Auth,
    AuthAdmin
} = require('./Auth')
const dbHandler = require('./dbHandler')
const JWT = require('jsonwebtoken')

const SK = process.env.SECRET_KEY
const EI = process.env.EXPIRES_IN

router.get("/barberGet", Auth(), async (req, res) => {
    return res.json(await dbHandler.barber.findAll({
        where: {
            id: req.uid
        }
    }))
})

// admin osszes barber lekerese
router.get("/barbersAll", AuthAdmin(), async (req, res) => {
    try {
        res.json(await dbHandler.barber.findAll({
            attributes: {
                exclude: ['password']
            }
        }));
    } catch (error) {
        res.status(500).json({
            message: "Szerverhiba"
        });
    }
});

function ValidateId() {
    return (req, res, next) => {
        if (isNaN(req.params.id)) return res.status(400).json({
            message: "Invalid ID"
        })
        next()
    }
}


// admin barmelyik barber torlese
router.delete("/barberDelete/:id",ValidateId(), AuthAdmin(), async (req, res) => {
    try {
        const Id = req.params.id


        const oneBarber = await dbHandler.barber.findOne({
            where: {
                id: Id
            }
        })
        if (!oneBarber) return res.status(404).json({
            message: "Nincs ilyen felhasználó"
        })

        await dbHandler.barber.destroy({
            where: {
                id: Id
            }
        })
        return res.status(200).json({
            message: "Sikeres törlés"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Szerverhiba"
        })
    }
})

// admin osszes log
router.get("/logsAll", AuthAdmin(), async (req, res) => {
    try {
        const logs = await dbHandler.log.findAll({
            include: [
                { model: dbHandler.user, attributes: ['name'] },
                { model: dbHandler.barber, attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: "Hiba" });
    }
});

router.post("/barberReg", async (req, res) => {
    const {
        email,
        name,
        password,
        phoneNum,
        isAdmin
    } = req.body
    if (!email || !name || !password || !phoneNum) return res.status(400).json({
        message: "Missing data"
    })
    const oneBarber = await dbHandler.barber.findOne({
        where: {
            email
        }
    })
    if (oneBarber) return res.status(400).json({
        message: "Mar van ilyen"
    })
    const hashedPassword = await bcrypt.hash(password, 9)
    const newBarber = await dbHandler.barber.create({
        name,
        email,
        password: hashedPassword,
        phoneNum,
        isAdmin: isAdmin || false
    })
    res.status(201).json({
        message: 'sikeres regisztracio',
        id: newBarber.id
    })
})

router.post('/barberLogin', async (req, res) => {
    try {
        const {
            email,
            name,
            password
        } = req.body
        if (!email || !name || !password) return res.status(400).json({
            message: "Missing data"
        })
        const oneBarber = await dbHandler.barber.findOne({
            where: {
                email
            }
        })
        if (!oneBarber) return res.status(401).json({
            "message": "Nem letezik ilyen felhasznalo"
        })
        if (oneBarber.name != name) return res.status(400).json({
            "message": "Hibas nev"
        })
        const validPassword = await bcrypt.compare(password, oneBarber.password)
        if (!validPassword) return res.status(400).json({
            message: "Hibás jelszó"
        })
        const token = JWT.sign({
            uid: oneBarber.id
        }, SK, {
            expiresIn: EI
        })
        return res.status(201).json({
            "message": "Sikeres bejelentkezés",
            token
        })
    } catch (err) {
        res.status(500).json({
            message: "Szerverhiba"
        })
    }
})

router.get("/logsMy", Auth(), async (req, res) => {
    try {
        const logs = await dbHandler.log.findAll({
            where: {
                barberID: req.uid
            },
            include: [{
                model: dbHandler.user,
                attributes: ['name']
            }],
            order: [
                ['createdAt', 'DESC']
            ]
        })
        res.json(logs)
    } catch (error) {
        res.status(500).json({
            message: "Hiba"
        })
    }
})

router.delete("/logsCleanup", Auth(), async (req, res) => {
    try {
        const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30))
        await dbHandler.log.destroy({
            where: {
                barberID: req.uid,
                createdAt: {
                    [Op.lt]: thirtyDaysAgo
                }
            }
        })
        res.json({
            message: "Sikeres takarítás"
        })
    } catch (error) {
        res.status(500).json({
            message: "Hiba"
        })
    }
})


router.put('/barberUpdate/:id', Auth(), async (req, res) => {
    try {
        const Id = req.params.id
        if (isNaN(Id)) return res.status(400).json({
            message: 'Invalid ID'
        })

        const oneBarber = await dbHandler.barber.findOne({
            where: {
                id: Id
            }
        })
        if (!oneBarber) return res.status(404).json({
            message: "Nincs ilyen felhasználó"
        })

        const {
            name,
            email,
            password,
            phoneNum
        } = req.body
        if (!name && !email && !password && !phoneNum) return res.status(400).json({
            message: "Nincs módosítandó adat"
        })
        if (name) await dbHandler.barber.update({
            name
        }, {
            where: {
                id: Id
            }
        })
        if (email) await dbHandler.barber.update({
            email
        }, {
            where: {
                id: Id
            }
        })
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 9)
            await dbHandler.barber.update({
                password: hashedPassword
            }, {
                where: {
                    id: Id
                }
            })
        }
        if (phoneNum) await dbHandler.barber.update({
            phoneNum
        }, {
            where: {
                id: Id
            }
        })

        res.json({
            'message': 'sikeres módosítás'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Szerverhiba'
        })
    }
})

module.exports = router