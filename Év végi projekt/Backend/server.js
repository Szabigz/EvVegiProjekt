const express = require("express");
const dbHandler = require("./dbHandler");
const { Op } = require('sequelize'); // <-- ez kell
const user = require("./user.js")
const barber = require('./barber.js')
const appointments = require("./appointments.js")
const services = require("./services.js")
const workhours = require("./workHours.js")
const path = require("path")

const server = express();
server.use(express.json());
server.use(express.static(path.join(__dirname, "../Frontend")));
dbHandler.user.sync()
dbHandler.barber.sync()
dbHandler.services.sync()
dbHandler.workhours.sync()
dbHandler.appointments.sync({alter:true})
dbHandler.log.sync()
require('dotenv').config()

server.get("/", (req,res)=>{
    res.sendFile (path.join(__dirname, "../Frontend/mainpage.html"))
})
const PORT = process.env.PORT


server.use("/", user)


server.use("/", barber)


server.use("/", appointments)


server.use("/", services)


server.use("/", workhours)

const log = require("./log")
server.use("/", log)

server.listen(PORT, ()=>console.log("a szerver fut a "+ PORT + "-es porton"))

module.exports=server