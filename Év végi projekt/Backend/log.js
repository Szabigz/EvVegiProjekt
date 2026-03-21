const dbHandler=require('./dbHandler')

function Log() {
    return async (req, res, next) => {
      try {
        const appointment = await dbHandler.appointments.findOne({
            where: { id: req.params.id }
          });
      
          if (!appointment) {
            return res.status(404).json({ message: "Nincs ilyen időpont" });
          }
          const user = appointment.userID || 1; 
          
          await dbHandler.log.create({
            appointmentID: appointment.id,
            userID: user,                  
            barberID: appointment.barberID,
            activity: "Időpont lemondva"    
          });
      
          next();
      } catch (err) {
        console.error("LOG HIBA:", err);
    next(err);
      }
    }
  }

  module.exports = Log;