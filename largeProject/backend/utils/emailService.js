require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        let info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
        console.log("Email sent: ", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

module.exports = sendEmail;
