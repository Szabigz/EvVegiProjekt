const express = require('express')
const router=express.Router()

const Auth=require('./Auth')
 
const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')
const { Op, where } = require("sequelize");


router.get("/workhoursGet",Auth(), async(req,res)=>{
    return res.json(await dbHandler.workhours.findAll())
})

router.get("/workhoursMy", Auth(), async (req, res) => {
    try {
        const workhours = await dbHandler.workhours.findAll({
            where: {
                barberID: req.uid
            }
        });
        res.json(workhours);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Szerverhiba" });
    }
});

router.post("/workhoursPost", Auth(), async(req,res)=>{
    const { dayOfWeek, start_time, end_time} = req.body
    const onewhour = await dbHandler.workhours.findOne({
        where:{
            barberID:req.uid,
            start_time: { [Op.lt]: end_time },
            end_time: { [Op.gt]: start_time }
        }
        
    })
    if(onewhour){
        return res.status(400).json({message:"Mar van ilyen"})
    }
    
    await dbHandler.workhours.create({
        barberID:req.uid,
        dayOfWeek:dayOfWeek,
        start_time:start_time,
        end_time:end_time
        
    })
    res.status(200).json({message: 'sikeres regisztracio'}).end()

})

router.delete("/workhoursDelete/:id", Auth(), async (req, res) => {
    try {
        const Id = req.params.id
        const barberID = req.uid;
        const oneWorkhour = await dbHandler.workhours.findOne({ where: { id:Id, barberID} });

        if (!oneWorkhour) {
            return res.status(400).json({ message: "Nincs ilyen felhasználó" });
        }

        await dbHandler.workhours.destroy({ where: { id:Id, barberID } });
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
                id:Id, barberID 
            }
        })
    }

    if(req.body.dayOfWeek){
        await dbHandler.workhours.update({
            dayOfWeek:req.body.dayOfWeek
        },{
            where:{
                id:Id, barberID 
            }
        })
    }
    if(req.body.start_time){
        await dbHandler.workhours.update({
            start_time:req.body.start_time
        },{
            where:{
                id:Id, barberID 
            }
        })
    }
    if(req.body.end_time){
        await dbHandler.workhours.update({
            end_time:req.body.end_time
        },{
            where:{
                id:Id, barberID 
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