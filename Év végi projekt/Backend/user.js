const express = require('express')
const router=express.Router()

const Auth=require('./Auth')
const log = require("./log")

const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')

const SK=process.env.SECRET_KEY
const EI=process.env.EXPIRES_IN 


router.post("/reg", async(req,res)=>{
    const {email, name, phoneNum} = req.body
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
        phoneNum:phoneNum
    })
    res.status(200).json({message: 'sikeres regisztracio'}).end()

})

router.post('/login', async(req,res)=>{
    try{
        const {email,name}=req.body
        const oneUser=await dbHandler.user.findOne({
            where:{
                email:email
            }
        })
        if(!oneUser){
            res.status(401).json({"message":"Nem letezik ilyen felhasznalo"})
        }
        else if(oneUser.name!=name){
            res.json({"message":"Hibas jelszo"})
        }
        const token=JWT.sign({uid:oneUser.id},SK,{expiresIn: EI})
        res.status(201).json({"message": "Sikeres bejelentkezes",token:token}).end()
    }
    catch(err){
        console.log(err)
    }
})










router.delete("/appointment/:id", Auth(), log(), async (req, res) => {
    await dbHandler.appointments.update(
        { status: "canceled" },
        { where: { id: req.params.id } }
    );
    res.send("Időpont lemondva");
  });

module.exports = router
