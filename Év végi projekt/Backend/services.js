const express = require('express')
const router=express.Router()

const Auth=require('./Auth')
 
const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')


router.get("/services",Auth(), async(req,res)=>{
    res.json(await dbHandler.services.findOne({where:{id:req.uid}}))
})


router.post("/services", async(req,res)=>{
    const {description, name, duration_minutes,price,barberID} = req.body
    const oneService = await dbHandler.services.findOne({
        where:{
            name:name,
        }
        
    })
    if(oneService){
        return res.status(400).json({message:"Mar van ilyen"})
    }
    
    await dbHandler.services.create({
        name:name,
        description:description,
        duration_minutes:duration_minutes,
        price:price,
        barberID:barberID
    })
    res.status(200).json({message: 'sikeres regisztracio'}).end()

})

router.delete('/services/:id', async (req, res) =>{
    const id = req.params.id
    const oneService = await dbHandler.services.findOne({where:{id:id}})
    if(oneService){
        await dbHandler.services.destroy({where:{id:id}})
        return res.json({'message': 'Sikeres törlés'}).end()

    }
    res.json({'messgae': 'Nem létezik ez a fodrász'}).end()
})

router.put('/service', Auth(), async (req,res) =>{
    if(!req.body.name){
        return res.status(400).json({'message':'nem jo'})
    }

    if(req.body.uid){
        await dbHandler.services.update({
            price:req.body.price
        },{
            where:{
                id:req.body.uid
            }
        })
    }


    res.json({'message':'sikeres módosítás'})

})

const SK=process.env.SECRET_KEY
const EI=process.env.EXPIRES_IN 
module.exports = router