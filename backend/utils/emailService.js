const axios = require("axios");
const {OtpTemplate}=require("../templates/OtpTemplate");

const sendOTP = async (email, otp) => {
    try {
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: process.env.BREVO_EMAIL,
                    email: process.env.BREVO_SENDER_EMAIL,
                },
                to: [
                    {
                        email: email,
                    },
                ],
                subject: "Password Reset OTP",
                htmlContent: OtpTemplate(otp),
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            }
        );

        console.log("Email Sent:", response.data);
    } catch (err) {
        console.error(
            err.response ? err.response.data : err.message
        );
        throw err;
    }
};

module.exports = sendOTP;