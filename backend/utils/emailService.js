const nodemailer = require("nodemailer");
const {OtpTemplate}=require("../templates/OtpTemplate");
console.log(process.env.BREVO_SMTP_LOGIN)
console.log(process.env.BREVO_SMTP_KEY)
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.BREVO_SMTP_LOGIN,
        pass: process.env.BREVO_SMTP_KEY,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
});

const sendOTP = async (email, otp) => {
    transporter.verify((err, success) => {
    if (err) {
        console.error("SMTP Verify Error:", err);
    } else {
        console.log("SMTP Ready");
    }
});
    await transporter.sendMail({

        from: `"EduMentor" <${process.env.EMAIL_USER}>`,

        to: email,

        subject: "Password Reset OTP",

        html:OtpTemplate(otp)
    });

};

module.exports = sendOTP;