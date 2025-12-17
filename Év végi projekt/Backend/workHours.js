const express = require('express')
const router=express.Router()

const Auth=require('./Auth')
 
const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')
const e = require('express')


router.get("/workhours",Auth(), async(req,res)=>{
    res.json(await dbHandler.workhours.findOne({where:{id:req.uid}}))
})


router.post("/workhours", Auth(), async(req,res)=>{
    const {barberID, dayOfWeek, start_time, end_time} = req.body
    const onewhour = await dbHandler.workhours.findOne({
        where:{
            start_time:start_time
        }
        
    })
    if(onewhour){
        return res.status(400).json({message:"Mar van ilyen"})
    }
    
    await dbHandler.workhours.create({
        barberID:barberID,
        dayOfWeek:dayOfWeek,
        start_time:start_time,
        end_time:end_time
        
    })
    res.status(200).json({message: 'sikeres regisztracio'}).end()

})

router.delete('/workhours/:id', async (req, res) =>{
    const id = req.params.id
    const onewhour = await dbHandler.workhours.findOne({where:{id:id}})
    if(onewhour){
        await dbHandler.workhours.destroy({where:{id:id}})
        return res.json({'message': 'Sikeres törlés'}).end()

    }
    res.json({'messgae': 'Nem létezik ez a fodrász'}).end()
})

const SK=process.env.SECRET_KEY
const EI=process.env.EXPIRES_IN 
module.exports = router