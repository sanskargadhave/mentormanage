const nodemailer = require("nodemailer");
const {OtpTemplate}=require("../templates/OtpTemplate");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
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