require('dotenv').config()
const nodemailer = require('nodemailer')

const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS
const BASE_URL = process.env.BASE_URL

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
})
async function sendBookingEmail(to, barberName, service, date, time) {

    if (process.env.NODE_ENV === 'test') {
        return;
    }

    try {
        await transporter.sendMail({
            from: `"Slick Barber Shop" <${EMAIL_USER}>`,
            to: to,
            subject: "Foglalás visszaigazolás",
            html: `
            <h2>Foglalás sikeres!</h2>
            <p><b>Fodrász:</b> ${barberName}</p>
            <p><b>Szolgáltatás:</b> ${service}</p>
            <p><b>Dátum:</b> ${date}</p>
            <p><b>Időpont:</b> ${time}</p>
            <br>
            <p>Várunk szeretettel!</p>
            <small>Le szeretnéd mondani? <a href="${BASE_URL}/HTML/mainpage.html" style="color: #d4af37; font-weight: bold; text-decoration: none;"> Irany a profilomhoz → </a></small>`
        })
        console.log("Email elküldve: " + to);
    } catch (error) {
        console.error("Sikertelen email küldés: ", error.message)
    }
}

module.exports = {
    sendBookingEmail
}