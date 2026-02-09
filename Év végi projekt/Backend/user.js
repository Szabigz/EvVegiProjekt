const express = require('express')
const router=express.Router()

const Auth=require('./Auth')
const log = require("./log")
const bcrypt = require("bcrypt")


const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')

const SK=process.env.SECRET_KEY
const EI=process.env.EXPIRES_IN 


router.get("/user",Auth(), async(req,res)=>{
    res.json(await dbHandler.user.findOne({where:{id:req.uid}}))
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
            res.status(401).json({"message":"Nem letezik ilyen felhasznalo"})
            const hashedPassword = await bcrypt.hash(password,9)
        }
        else if(oneUser.name!=name){
            res.json({"message":"Hibas nev"})
        }
        else if(oneUser.password!=password){
            res.json({"message":"Hibas jelszo"})
            const hashedPassword = await bcrypt.hash(password,9)
        }
        if(user.username == username && bcrypt.compare(password, user.password)){
            res.status(200).json({message:"succesful login"}).end()
        }
        const token=JWT.sign({uid:oneUser.id},SK,{expiresIn: EI})
        res.status(201).json({"message": "Sikeres bejelentkezes",token:token}).end()
    }
    catch(err){
        console.log(err)
    }
})












module.exports = router
