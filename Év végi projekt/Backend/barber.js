const express = require('express')
const router=express.Router()
const bcrypt = require("bcrypt")


const Auth=require('./Auth')
 
const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')

const SK=process.env.SECRET_KEY
const EI=process.env.EXPIRES_IN 


router.get("/barberGet",Auth(), async(req,res)=>{
    return res.json(await dbHandler.barber.findAll({where:{id:req.uid}}))
})


router.post("/barberReg", async(req,res)=>{
    console.log(req.body)
    const {email, name, password, phoneNum, isAdmin} = req.body
    const oneBarber = await dbHandler.barber.findOne({
        where:{
            email:email
        }
        
    })
    if(oneBarber){
        return res.status(400).json({message:"Mar van ilyen"})
    }
    const hashedPassword = await bcrypt.hash(password,9)
    
    
    await dbHandler.barber.create({
        name:name,
        email:email,
        password: hashedPassword,
        phoneNum:phoneNum,
        isAdmin: isAdmin
    })
    dbHandler.barber.password = await bcrypt.hash(password,9)
    res.status(200).json({message: 'sikeres regisztracio'}).end()

})

router.post('/barberLogin', async(req,res)=>{
    try{
        const {email,name, password}=req.body

        
        const oneBarber=await dbHandler.barber.findOne({
            where:{
                email:email
            }
        })
        if(!oneBarber){
            return res.status(401).json({"message":"Nem letezik ilyen felhasznalo"})
        }
        else if(oneBarber.name!=name){
            return res.status(400).json({"message":"Hibas nev"})
        }
        const validPassword = await bcrypt.compare(password, oneBarber.password)
        

        if(!validPassword){
            return res.status(401).json({message:"Hibás jelszó"})
        }
        const token=JWT.sign({uid:oneBarber.id},SK,{expiresIn: EI})
            
        return res.status(201).json({"message": "Sikeres bejelentkezes",token:token}).end()
        
        
        
    }
    catch(err){
        console.log(err)
    }
})


router.delete("/barberDelete/:id", Auth(), async (req, res) => {
    try {
        const Id = req.params.id
        const id = req.uid;
        const oneBarber = await dbHandler.barber.findOne({ where: { id:Id } });

        if (!oneBarber) {
            return res.status(400).json({ message: "Nincs ilyen felhasználó" });
        }

        await dbHandler.barber.destroy({ where: { id:Id } });
        return res.status(200).json({ message: "Sikeres törlés" });

    }  catch(error) { 
        console.log("asdads", error.message);
        res.status(500).json({ message: "Szerverhiba" });
    }
});

router.put('/barberUpdate/:id', Auth(), async(req,res) =>{

    try {
        const Id = req.params.id
        const id = req.uid
        const oneBarber = await dbHandler.barber.findOne({ where: { id:Id } });

        if (!oneBarber) {
            return res.status(400).json({ message: "Nincs ilyen felhasználó" });
        }
        if(!id){
        return res.status(400).json({'message': 'Hiányzó ID'})
    }

    if(req.body.name){
        await dbHandler.barber.update({
            name:req.body.name
        },{
            where:{
                id:Id
            }
        })
    }

    if(req.body.email){
        await dbHandler.barber.update({
            email:req.body.email
        },{
            where:{
                id:Id
            }
        })
    }

    if(req.body.password){
        await dbHandler.barber.update({
            password:req.body.password
        },{
            where:{
                id:Id
            }
        })
    }
    if(req.body.phoneNum){
        await dbHandler.barber.update({
            phoneNum:req.body.phoneNum
        },{
            where:{
                id:Id
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