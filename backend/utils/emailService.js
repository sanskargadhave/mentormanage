const Brevo = require("@getbrevo/brevo");
const {OtpTemplate}=require("../templates/OtpTemplate");

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
);

const sendOTP = async (email, otp) => {
    try {

        await apiInstance.sendTransacEmail({

            sender: {
                email: process.env.BREVO_EMAIL,
                name: process.env.BREVO_SENDER_NAME
            },

            to: [
                {
                    email: email
                }
            ],

            subject: "Password Reset OTP",

            htmlContent: OtpTemplate(otp)

        });

        console.log("OTP Email Sent");

    } catch (err) {

        console.log(err.response?.body || err);

        throw err;

    }
};

module.exports = sendOTP;