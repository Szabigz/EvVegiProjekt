const express = require('express')
const router=express.Router()

const Auth=require('./Auth')
 
const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')
const e = require('express')


router.get("/workhoursGet",Auth(), async(req,res)=>{
    return res.json(await dbHandler.workhours.findAll())
})


router.post("/workhoursPost", Auth(), async(req,res)=>{
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

router.delete("/workhoursDelete/:id", Auth(), async (req, res) => {
    try {
        const Id = req.params.id
        const id = req.uid;
        const oneWorkhour = await dbHandler.workhours.findOne({ where: { id:Id } });

        if (!oneWorkhour) {
            return res.status(400).json({ message: "Nincs ilyen felhasználó" });
        }

        await dbHandler.workhours.destroy({ where: { id:Id } });
        return res.status(200).json({ message: "Sikeres törlés" });

    }  catch(error) { 
        console.log("asdads", error.message);
        res.status(500).json({ message: "Szerverhiba" });
    }
});

router.put('/workhoursUpdate/:id', Auth(), async(req,res) =>{

    try {
        const Id = req.params.id
        const id = req.uid
        const oneService = await dbHandler.workhours.findOne({ where: { id:Id } });

        if (!oneService) {
            return res.status(400).json({ message: "Nincs ilyen felhasználó" });
        }
        if(!id){
        return res.status(400).json({'message': 'Hiányzó Tool ID'})
    }


    if(req.body.barberID){
        await dbHandler.workhours.update({
            barberID:req.body.barberID
        },{
            where:{
                id:Id
            }
        })
    }

    if(req.body.dayOfWeek){
        await dbHandler.workhours.update({
            dayOfWeek:req.body.dayOfWeek
        },{
            where:{
                id:Id
            }
        })
    }
    if(req.body.start_time){
        await dbHandler.workhours.update({
            start_time:req.body.start_time
        },{
            where:{
                id:Id
            }
        })
    }
    if(req.body.end_time){
        await dbHandler.workhours.update({
            end_time:req.body.end_time
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

const SK=process.env.SECRET_KEY
const EI=process.env.EXPIRES_IN 
module.exports = router