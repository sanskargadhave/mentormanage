const nodemailer = require("nodemailer");
const {OtpTemplate}=require("../templates/OtpTemplate");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_LOGIN,
        pass: process.env.BREVO_SMTP_KEY,
    },
});

const sendOTP = async (email, otp) => {
    
    await transporter.sendMail({

        from: `"EduMentor" <${process.env.EMAIL_USER}>`,

        to: email,

        subject: "Password Reset OTP",

        html:OtpTemplate(otp)
    });

};

module.exports = sendOTP;