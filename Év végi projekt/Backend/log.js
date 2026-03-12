
const express = require('express')
const router=express.Router()
const Auth=require('./Auth')


const dbHandler=require('./dbHandler')
const JWT= require('jsonwebtoken')

const SK=process.env.SECRET_KEY
const EI=process.env.EXPIRES_IN 

function Log() {
    return async (req, res, next) => {
      try {
        const appointment = await dbHandler.appointments.findOne({
            where: { id: req.params.id }
          });
      
          if (!appointment) {
            return res.status(404).json({ message: "Nincs ilyen időpont" });
          }
          const user = appointment.userID || 1; // fallback ha null
          
          await dbHandler.log.create({
            appointmentID: appointment.id,
            userID: user,                  // Auth middleware által beállított felhasználó ID
            barberID: appointment.barberID,
            activity: "Időpont lemondva"     // ide kerül a szöveges jelzés
          });
      
          next();
      } catch (err) {
        console.error("LOG HIBA:", err);
    next(err);
      }
    }
  }
  
  module.exports = Log;
