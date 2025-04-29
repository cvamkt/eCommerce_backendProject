const nodemailer = require("nodemailer")


exports.sendEmail = async(to, subject, text) => {
    const sender = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })

    await sender.sendMail({
        from : process.env.EMAIL_USER,
        to,
        subject,
        text
    })
}