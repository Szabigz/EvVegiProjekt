const express = require("express");
const dbHandler = require("./dbHandler");

const user = require("./user.js")
const barber = require('./barber.js')
const appointments = require("./appointments.js")
const services = require("./services.js")
const workhours = require("./workHours.js")

const server = express();
server.use(express.json());
server.use(express.static("public"));
dbHandler.user.sync()
dbHandler.barber.sync()
dbHandler.workhours.sync()
dbHandler.appointments.sync()
dbHandler.services.sync()
dbHandler.log.sync()

require('dotenv').config()
const PORT = process.env.PORT


server.use("/", user)


server.use("/", barber)


server.use("/", appointments)


server.use("/", services)


server.use("/", workhours)

const log = require("./log")
server.use("/", log)

server.listen(PORT, ()=>console.log("a szerver fut a"+ PORT + "es porton"))

module.exports=server