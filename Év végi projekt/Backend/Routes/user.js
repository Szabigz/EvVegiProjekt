const express = require('express')
const router = express.Router()
const {
    Auth,
    AuthUser,
    AuthBarber,
    AuthAdmin
} = require('../Middleware/Auth')

const bcrypt = require("bcrypt")
const dbHandler = require('../dbHandler')
const JWT = require('jsonwebtoken')

const SK = process.env.SECRET_KEY
const EI = process.env.EXPIRES_IN

router.get("/userGet", AuthUser(), async (req, res) => {
    return res.json(await dbHandler.user.findAll({
        where: {
            id: req.uid
        }
    }))
})

router.get("/usersAll", AuthBarber(), async (req, res) => {
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
        })
        const oneUser = await dbHandler.user.findOne({
            where: {
                id: Id
            }
        })
        if (!oneUser) return res.status(404).json({
            message: "Nincs ilyen felhasználó"
        })

        const requester = await dbHandler.barber.findByPk(req.uid)
        const isAdmin = requester && requester.isAdmin

        if (!isAdmin && Number(req.uid) !== Number(Id)) {
            return res.status(403).json({
                message: "Nincs jogosultságod más fiókját törölni"
            })
        }


        await dbHandler.appointments.update({
            status: 'canceled'
        }, {
            where: {
                userID: Id,
                status: 'booked'
            }
        })

        await dbHandler.user.destroy({
            where: {
                id: Id
            }
        })

        return res.status(200).json({
            message: "Sikeres törlés, az időpontok lemondva"
        })
    } catch (err) {
        return res.status(500).json({
            message: "Szerverhiba"
        })
    }
})

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
        return res.status(400).json({
            message: "Invalid email"
        })
    }

    if (name.length < 2) {
        return res.status(400).json({
            message: "Name too short"
        })
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "Weak password"
        })
    }

    if (!isValidHungarianPhone(phoneNum)) {
        return res.status(400).json({
            message: "Érvénytelen formátum! (Példa: +36201234567)"
        })
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
            password
        } = req.body
        if (!email || !password) return res.status(400).json({
            message: "Missing data"
        })
        const oneUser = await dbHandler.user.findOne({
            where: {
                email
            }
        })
        if (!oneUser || oneUser.email !== email) return res.status(400).json({
            message: "Hibás email"
        })
        const validPassword = await bcrypt.compare(password, oneUser.password)
        if (!validPassword) return res.status(400).json({
            message: "Hibás jelszó"
        })
        const token = JWT.sign({
            uid: oneUser.id,
            role: 'user'
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

        let isAllowed = false
        if (req.role === 'user' && Number(req.uid) === Number(Id)) {
            isAllowed = true
        } else if (req.role === 'barber') {
            const requester = await dbHandler.barber.findByPk(req.uid)
            if (requester && requester.isAdmin) {
                isAllowed = true
            }
        }

        if (!isAllowed) {
            return res.status(403).json({
                message: "Forbidden"
            })
        }
        const oneUser = await dbHandler.user.findOne({
            where: {
                id: Id
            }
        })
        if (!oneUser) return res.status(404).json({
            message: "Nincs ilyen felhasználó"
        })
        if (!name && !email && !password && !phoneNum) return res.status(400).json({
            message: "Nincs módosítandó adat"
        })

        if (password && password.length < 6) {
            return res.status(400).json({
                message: "Weak password"
            })
        }

        if (phoneNum && !isValidHungarianPhone(phoneNum)) {
            return res.status(400).json({
                message: "Érvénytelen formátum! (Példa: +36201234567)"
            })
        }
        let updateData = {}
        if (password) updateData.password = await bcrypt.hash(password, 9)
        if (phoneNum) updateData.phoneNum = phoneNum
        if (email) updateData.email = email
        if (name) updateData.name = name

        await dbHandler.user.update(updateData, {
            where: {
                id: Id
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
function isValidHungarianPhone(phone) {
    if (!phone.startsWith('+')) return false
    const digits = phone.slice(1)
    const onlyNumbers = /^\d+$/.test(digits)
    return onlyNumbers && digits.length >= 9
}


module.exports = router