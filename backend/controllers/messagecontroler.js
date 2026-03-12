const twilio =require("twilio");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendMessage=async (req,resp)=>{
    try{
        const { name, marks, totalMarks, phone } = req.body;
        const me2=`आदरणीय पालक,

        आपल्या मुलगा/मुलगी ${name} यांना अलीकडील परीक्षेत 
        ${marks}/${totalMarks} गुण मिळाले असून ते उत्तीर्ण झाले नाहीत.

        कृपया त्यांच्या अभ्यासाकडे विशेष लक्ष देऊन पुढील परीक्षेसाठी त्यांना मार्गदर्शन करावे.

        हा संदेश Sangola Mahavidyala Sangola कडून पाठविण्यात आला आहे.

        धन्यवाद.`
        const message = await client.messages.create({
            from: "whatsapp:+14155238886",
            to: `whatsapp:+91${phone}`,   
            body: me2   
        });
        resp.status(200).json({success: true, sid: message.sid})
    }
    catch(err)
    {
        resp.status(500).json({message:err.message});
    }
}

module.exports={sendMessage};
