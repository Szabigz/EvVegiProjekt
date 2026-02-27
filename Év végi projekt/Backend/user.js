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


router.get("/user",Auth(), async(req,res)=>{
    return res.json(await dbHandler.user.findOne({where:{id:req.uid}}))
})


router.post("/reg", async(req,res)=>{
    console.log(req.body)
    const {email, name, password, phoneNum} = req.body
    const oneUser = await dbHandler.user.findOne({
        where:{
            email:email
        }
        
    })
    if(oneUser){
        return res.status(400).json({message:"Mar van ilyen"})
    }
    
    await dbHandler.user.create({
        name:name,
        email:email,
        password: password,
        phoneNum:phoneNum
    })
    dbHandler.user.password = await bcrypt.hash(password,9)
    res.status(200).json({message: 'sikeres regisztracio'}).end()

})

router.post('/login', async(req,res)=>{
    try{
        const {email,name, password}=req.body

        
        const oneUser=await dbHandler.user.findOne({
            where:{
                email:email
            }
        })
        if(!oneUser){
            return res.status(401).json({"message":"Nem letezik ilyen felhasznalo"})
        }
        else if(oneUser.name!=name){
            return res.json({"message":"Hibas nev"})
        }
        else if(oneUser.password!=password){
            res.json({"message":"Hibas jelszo"})
        }
        if(oneUser.name == name && bcrypt.compare(password, oneUser.password)){
             const token=JWT.sign({uid:oneUser.id},SK,{expiresIn: EI})
            return res.status(201).json({"message": "Sikeres bejelentkezes",token:token}).end()
        }
        
        
    }
    catch(err){
        console.log(err)
    }
})


router.delete("/userDelete/:id", Auth(), async (req, res) => {
    try {
        const id = req.uid;
        const oneUser = await dbHandler.user.findOne({ where: { id } });

        if (!oneUser) {
            return res.status(400).json({ message: "Nincs ilyen felhasználó" });
        }

        await dbHandler.user.destroy({ where: { id } });
        return res.status(200).json({ message: "Sikeres törlés" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Szerverhiba" });
    }
});
router.put('/userUpdate/:id', Auth(), async(req,res) =>{

    try {
        const id = req.uid
        const oneUser = await dbHandler.user.findOne({ where: { id } });

        if (!oneUser) {
            return res.status(400).json({ message: "Nincs ilyen felhasználó" });
        }
        if(!id){
        return res.status(400).json({'message': 'Hiányzó Tool ID'})
    }

    if(req.body.name){
        await dbHandler.user.update({
            name:req.body.name
        },{
            where:{
                id:id
            }
        })
    }

    if(req.body.email){
        await dbHandler.user.update({
            email:req.body.email
        },{
            where:{
                id:id
            }
        })
    }

    if(req.body.password){
        await dbHandler.user.update({
            password:req.body.password
        },{
            where:{
                id:id
            }
        })
    }
    if(req.body.phoneNum){
        await dbHandler.user.update({
            phoneNum:req.body.phoneNum
        },{
            where:{
                id:id
            }
        })
    }
    res.json({'message':'sikeres módosítás'})
    } catch (error) {
        console.log(error);
    return res.status(500).json({ message: 'Szerverhiba' });
    }
    

})












module.exports = router
