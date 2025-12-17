const express = require('express')
const router=express.Router()

const Auth=require('./Auth')
 
const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')

const SK=process.env.SECRET_KEY
const EI=process.env.EXPIRES_IN 


router.get("/barber",Auth(), async(req,res)=>{
    res.json(await dbHandler.barber.findOne({where:{id:req.uid}}))
})


router.post("/barber", Auth(), async(req,res)=>{
    const { name} = req.body
    const oneBarber = await dbHandler.barber.findOne({
        where:{
            name:name
        }
        
    })
    if(oneBarber){
        return res.status(400).json({message:"Mar van ilyen"})
    }
    
    await dbHandler.barber.create({
        name:name,
        
    })
    res.status(200).json({message: 'sikeres regisztracio'}).end()

})

router.delete('/barber/:id', async (req, res) =>{
    const id = req.params.id
    const oneBarber = await dbHandler.barber.findOne({where:{id:id}})
    if(oneBarber){
        await dbHandler.barber.destroy({where:{id:id}})
        return res.json({'message': 'Sikeres törlés'}).end()

    }
    res.json({'messgae': 'Nem létezik ez a fodrász'}).end()
})


router.put('/barber', Auth(), async (req,res) =>{
    if(!req.body.name){
        return res.status(400).json({'message':'nem jo'})
    }

    if(req.body.uid){
        await dbHandler.barber.update({
            name:req.body.name
        },{
            where:{
                id:req.body.uid
            }
        })
    }


    res.json({'message':'sikeres módosítás'})

})



module.exports = router