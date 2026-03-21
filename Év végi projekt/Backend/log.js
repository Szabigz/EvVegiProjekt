const dbHandler = require('./dbHandler')

function Log() {
  return async (req, res, next) => {
    try {
      const appointment = await dbHandler.appointments.findOne({
        where: {
          id: req.params.id
        }
      })

      if (!appointment) return next()

      const actorId = req.uid
      const isBarber = (actorId === appointment.barberID)
      let activityText = ""

      if (req.method === 'DELETE') {
        if (isBarber) {
          activityText = "Időpont törölve a barber által"
        } else {
          activityText = "Időpont lemondva a vendég által"
        }
      } else if (req.method === 'PUT' && req.body.status === 'canceled') {
        if (isBarber) {
          activityText = "Időpont lemondva a barber által"
        } else {
          activityText = "Időpont lemondva a vendég által"
        }
      } else if (req.method === 'PUT') {
        activityText = "Időpont adatai módosítva"
      }

      if (activityText !== "") {
        const user = appointment.userID || 1
        await dbHandler.log.create({
          appointmentID: appointment.id,
          userID: user,
          barberID: appointment.barberID,
          activity: activityText
        })
      }

      next()
    } catch (err) {
      console.error("LOG HIBA:", err)
      next(err)
    }
  }
}

module.exports = Log