const express = require('express')
const router=express.Router()

const Auth=require('./Auth')
 
const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')


router.get("/servicesGet",Auth(), async(req,res)=>{
    return res.json(await dbHandler.services.findAll())
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

router.delete("/servicesDelete/:id", Auth(), async (req, res) => {
    try {
        const Id = req.params.id
        const id = req.uid;
        const oneService = await dbHandler.services.findOne({ where: { id:Id } });

        if (!oneService) {
            return res.status(400).json({ message: "Nincs ilyen felhasználó" });
        }

        await dbHandler.services.destroy({ where: { id:Id } });
        return res.status(200).json({ message: "Sikeres törlés" });

    }  catch(error) { 
        console.log("asdads", error.message);
        res.status(500).json({ message: "Szerverhiba" });
    }
});

router.put('/servicesUpdate/:id', Auth(), async(req,res) =>{

    try {
        const Id = req.params.id
        const id = req.uid
        const oneService = await dbHandler.services.findOne({ where: { id:Id } });

        if (!oneService) {
            return res.status(400).json({ message: "Nincs ilyen felhasználó" });
        }
        if(!id){
        return res.status(400).json({'message': 'Hiányzó Tool ID'})
    }

    if(req.body.name){
        await dbHandler.services.update({
            name:req.body.name
        },{
            where:{
                id:Id
            }
        })
    }

    if(req.body.barberID){
        await dbHandler.services.update({
            barberID:req.body.barberID
        },{
            where:{
                id:Id
            }
        })
    }

    if(req.body.description){
        await dbHandler.services.update({
            description:req.body.description
        },{
            where:{
                id:Id
            }
        })
    }
    if(req.body.duration_minutes){
        await dbHandler.services.update({
            duration_minutes:req.body.duration_minutes
        },{
            where:{
                id:Id
            }
        })
    }
    if(req.body.price){
        await dbHandler.services.update({
            price:req.body.price
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