const express = require('express')
const router=express.Router()

const Auth=require('./Auth')
const log = require("./log")
const bcrypt = require("bcrypt")
require('dotenv').config();



const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')

const SK=process.env.SECRET_KEY
const EI=process.env.EXPIRES_IN 


router.get("/userGet",Auth(), async(req,res)=>{
    return res.json(await dbHandler.user.findAll({where:{id:req.uid}}))
})

// route a userek lekeresehez, a barbernek kell  - Csongor 03.17
router.get("/usersAll", Auth(), async (req, res) => {
    try {
        const users = await dbHandler.user.findAll({
            attributes: ['id', 'name', 'email']
        });
        res.json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Szerverhiba a vendégek lekérésekor" });
    }
});

router.post("/userReg", async (req, res) => {
    console.log(req.body);

    const { email, name, password, phoneNum } = req.body

    if (!email || !name || !password || !phoneNum) {
        return res.status(400).json({ message: "Missing data" });
    }

    try {
        const oneUser = await dbHandler.user.findOne({
            where: { email: email }
        });

        if (oneUser) {
            return res.status(400).json({ message: "Mar van ilyen" });
        }

        const hashedPassword = await bcrypt.hash(password, 9)

        const newUser = await dbHandler.user.create({
            email,
            name,
            password: hashedPassword,
            phoneNum
        });

        return res.status(201).json(newUser);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});


router.post('/userLogin', async(req,res)=>{
    try{
        const {email, name, password}=req.body

        const oneUser=await dbHandler.user.findOne({
            where:{ email:email }
        })

        if(!oneUser){
            return res.status(400).json({message:"Nem létezik ilyen felhasználó"})
        }

        if(oneUser.name !== name){
            return res.status(400).json({message:"Hibás név"})
        }

        const validPassword = await bcrypt.compare(password, oneUser.password)

        if(!validPassword){
            return res.status(400).json({message:"Hibás jelszó"})
        }

        const token = JWT.sign({uid:oneUser.id}, SK, {expiresIn: EI})

        return res.status(200).json({
            message: "Sikeres bejelentkezés",
            token: token
        })

    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Szerver hiba"})
    }
})


router.delete("/userDelete/:id", Auth(), async (req, res) => {
    try {
        const Id = req.params.id
        const id = req.uid;
        
        if (isNaN(Id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const oneUser = await dbHandler.user.findOne({ where: { id:Id } })

        if (!oneUser) {
            return res.status(404).json({ message: "Nincs ilyen felhasználó" });
        }

        await dbHandler.user.destroy({ where: { id:Id } });
        return res.status(200).json({ message: "Sikeres törlés" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Szerverhiba" });
    }
});
router.put('/userUpdate/:id', Auth(), async(req,res) =>{

    try {
        const Id = req.params.id
        const id = req.uid
        const oneUser = await dbHandler.user.findOne({ where: { id:Id } })

        if (isNaN(Id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        if (!oneUser) {
            return res.status(404).json({ message: "Nincs ilyen felhasználó" });
        }
        if (!id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!req.body.name && !req.body.email && !req.body.password && !req.body.phoneNum) {
            return res.status(400).json({ message: "No data to update" });
        }
        

    if(req.body.name){
        await dbHandler.user.update({
            name:req.body.name
        },{
            where:{
                id:Id
            }
        })
    }

    if(req.body.email){
        await dbHandler.user.update({
            email:req.body.email
        },{
            where:{
                id:Id
            }
        })
    }

    if(req.body.password){
        await dbHandler.user.update({
            password:req.body.password
        },{
            where:{
                id:Id
            }
        })
    }
    if(req.body.phoneNum){
        await dbHandler.user.update({
            phoneNum:req.body.phoneNum
        },{
            where:{
                id:Id
            }
        })
    }
    res.json({'message':'sikeres módosítás'})
    } catch (error) {
        console.log(error)
    return res.status(500).json({ message: 'Szerverhiba' });
    }
    

})












module.exports = router
