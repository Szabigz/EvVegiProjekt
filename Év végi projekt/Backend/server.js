const express = require("express");
const dbHandler = require("./dbHandler");
const {
    Op
} = require('sequelize');
const user = require("./Routes/user.js")
const barber = require('./Routes/barber.js')
const appointments = require("./Routes/appointments.js")
const services = require("./Routes/services.js")
const workhours = require("./Routes/workHours.js")
const path = require("path")

const server = express();
server.use(express.json({ limit: '10mb' }));
server.use(express.urlencoded({ limit: '10mb', extended: true }));
server.use(express.static(path.join(__dirname, "../Frontend")));
dbHandler.db.sync()
require('dotenv').config()

server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/HTML/mainpage.html"))
})
const PORT = process.env.PORT


server.use("/", user)


server.use("/", barber)


server.use("/", appointments)


server.use("/", services)


server.use("/", workhours)

const log = require("./Middleware/log")
server.use("/", log)

server.listen(PORT, () => console.log("a szerver fut a " + PORT + "-es porton"))

module.exports = server