const express = require('express')
const router = express.Router()
const {
    Auth
} = require('./Auth')
const bcrypt = require("bcrypt")
const dbHandler = require('./dbHandler')
const JWT = require('jsonwebtoken')

const SK = process.env.SECRET_KEY
const EI = process.env.EXPIRES_IN

router.get("/userGet", Auth(), async (req, res) => {
    return res.json(await dbHandler.user.findAll({
        where: {
            id: req.uid
        }
    }))
})

router.get("/usersAll", Auth(), async (req, res) => {
    try {
        const users = await dbHandler.user.findAll({
            attributes: ['id', 'name', 'email', 'phoneNum']
        })
        res.json(users)
    } catch (error) {
        res.status(500).json({
            message: "Szerverhiba"
        })
    }
})

router.delete("/userDelete/:id", Auth(), async (req, res) => {
    try {
        const Id = parseInt(req.params.id)
        if (isNaN(Id)) return res.status(400).json({
            message: "Invalid ID"
        });
        const oneUser = await dbHandler.user.findOne({
            where: {
                id: Id
            }
        });
        if (!oneUser) return res.status(404).json({
            message: "Nincs ilyen felhasználó"
        })

        const requester = await dbHandler.barber.findByPk(req.uid);
        const isAdmin = requester && requester.isAdmin;

        if (!isAdmin && Number(req.uid) !== Number(Id)) {
            return res.status(403).json({
                message: "Nincs jogosultságod más fiókját törölni"
            });
        }


        await dbHandler.appointments.update({
            status: 'canceled'
        }, {
            where: {
                userID: Id,
                status: 'booked'
            }
        });

        await dbHandler.user.destroy({
            where: {
                id: Id
            }
        });

        return res.status(200).json({
            message: "Sikeres törlés, az időpontok lemondva"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Szerverhiba"
        });
    }
});

router.post("/userReg", async (req, res) => {
    const {
        email,
        name,
        password,
        phoneNum
    } = req.body
    if (!email || !name || !password || !phoneNum) return res.status(400).json({
        message: "Missing data"
    })

    if (!email.includes("@")) {
    return res.status(400).json({ message: "Invalid email" })
    }

    if (name.length < 2) {
    return res.status(400).json({ message: "Name too short" })
    }

    if (password.length < 6) {
    return res.status(400).json({ message: "Weak password" })
    }

    if (phoneNum.length < 6) {
    return res.status(400).json({ message: "Invalid phone number" })
    }
    
    try {
        const oneUser = await dbHandler.user.findOne({
            where: {
                email
            }
        })
        if (oneUser) return res.status(400).json({
            message: "Mar van ilyen"
        })
        const hashedPassword = await bcrypt.hash(password, 9)
        const newUser = await dbHandler.user.create({
            email,
            name,
            password: hashedPassword,
            phoneNum
        })
        return res.status(201).json(newUser)
    } catch (err) {
        return res.status(500).json({
            message: "Server error"
        })
    }
})

router.post('/userLogin', async (req, res) => {
    try {
        const {
            email,
            name,
            password
        } = req.body
        if (!email || !name || !password) return res.status(400).json({
            message: "Missing data"
        })
        const oneUser = await dbHandler.user.findOne({
            where: {
                email
            }
        })
        if (!oneUser || oneUser.name !== name) return res.status(400).json({
            message: "Hibás név vagy email"
        })
        const validPassword = await bcrypt.compare(password, oneUser.password)
        if (!validPassword) return res.status(400).json({
            message: "Hibás jelszó"
        })
        const token = JWT.sign({
            uid: oneUser.id
        }, SK, {
            expiresIn: EI
        })
        return res.status(200).json({
            message: "Sikeres bejelentkezés",
            token
        })
    } catch (err) {
        res.status(500).json({
            message: "Szerver hiba"
        })
    }
})

router.put('/userUpdate/:id', Auth(), async (req, res) => {
    const {
        password,
        phoneNum,
        email,
        name
    } = req.body
    try {
        const Id = req.params.id
        if (isNaN(Id)) return res.status(400).json({
            message: "Invalid ID"
        })
        const oneUser = await dbHandler.user.findOne({
            where: {
                id: Id
            }
        })
        if (!oneUser) return res.status(404).json({
            message: "Nincs ilyen felhasználó"
        })
        if (!name && !email && !password && !phoneNum) return res.status(400).json({
            message: "Nincs módosítanó adat"
        })

        let updateData = {};
        if (password) updateData.password = await bcrypt.hash(password, 9);
        if (phoneNum) updateData.phoneNum = phoneNum;

        await dbHandler.user.update(updateData, {
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