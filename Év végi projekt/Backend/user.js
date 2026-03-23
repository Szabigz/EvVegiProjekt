const express = require('express')
const router = express.Router()
const Auth = require('./Auth')
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
            attributes: ['id', 'name', 'email']
        }) 
        res.json(users)
    } catch (error) {
        res.status(500).json({
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

router.delete("/userDelete/:id", Auth(), async (req, res) => {
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
        await dbHandler.user.destroy({
            where: {
                id: Id
            }
        }) 
        return res.status(200).json({
            message: "Sikeres törlés"
        }) 
    } catch (err) {
        return res.status(500).json({
            message: "Szerverhiba"
        }) 
    }
}) 

router.put('/userUpdate/:id', Auth(), async (req, res) => {
    const {password, phoneNum}=req.body
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

        if (!req.body.name && !req.body.email && !req.body.password && !req.body.phoneNum) {
            return res.status(400).json({
                message: "No data to update"
            }) 
        }
        let updateData = {};
        if (password) {
            updateData.password = await bcrypt.hash(password, 9);
        }

        if (phoneNum) {
            updateData.phoneNum = phoneNum;
        }

        await dbHandler.user.update(updateData, {
            where: { id: Id }
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