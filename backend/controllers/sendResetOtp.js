const bcrypt=require("bcryptjs");
const {PasswordReset}=require("../model/PasswordResetScema");
const sendOTP=require("../utils/emailService");
const adduser=require("../model/userSchema");

const SendResetOtp=async (req,resp)=>{
    try{
        const {emailid}=req.body;
        const existing = await PasswordReset.findOne({ email:emailid });
        if(!emailid)
        {
            return resp.status(400).json({success:false,message:"Email Is Required"});
        }

        if(existing){
            const diff = Date.now() - existing.createdAt.getTime();
            if (diff < 60000) {
                const seconds = Math.ceil((60000 - diff) / 1000);

                return resp.status(429).json({
                    success: false,
                    message: `Please wait ${seconds} seconds before requesting another OTP.`
                });

            }
            await PasswordReset.deleteOne({ _id: existing._id });

        }

        
        const user=await adduser.findOne({emailid});
        if(!user)
        {
            return resp.status(404).json({success:false,message:"Sorry This Email Is not Registered.."});

        }
        const otp=Math.floor(100000 + Math.random() * 900000).toString();
        await PasswordReset.deleteMany({emailid});
        await PasswordReset.create({
            email:emailid,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });
        await sendOTP(emailid,otp);

        return resp.status(200).json({
            success: true,
            message: "OTP sent successfully.",
        });
    }
    catch(err)
    {
        console.log(err);
        return resp.status(500).json({ success: false, message: "Internal Server Error",});
    }
}

const VerifyOtp=async (req,resp)=>{
    try{
        const {emailid,otp}=req.body;
        const record=await PasswordReset.findOne({email:emailid});
        if(!record)
        {
            return resp.status(400).json({success:false,message:"OTP Expired."})
        }
        if (record.otp !== otp) {
            return resp.status(400).json({ success: false, message: "Invalid OTP." });
        }

        if (record.expiresAt < new Date()) {
            return resp.status(400).json({ success: false, message: "OTP expired."});
        }

        record.verified=true;
        await record.save();

        return resp.status(200).json({
            success: true,
            message: "OTP verified.",
        });
    }
    catch(err)
    {
       console.log(err);
       return resp.status(500).json({ success: false, message: "Internal Server Error"});
    }
}

const ResetPassword=async (req,resp)=>{
    try{
        const {emailid,password}=req.body;
        const record = await PasswordReset.findOne({email:emailid,verified:true});
        if(!record)
        {
            return resp.status(400).json({success:false,message:"Otp Verification Required"});
        }
        if (!password) {
            return resp.status(400).json({ success: false, message: "Password is required."});
        }
        const user =await adduser.findOne({emailid});

        if(!user){
            return resp.status(404).json({ success:false, message:"User not found."});
        }

        const isSame=await bcrypt.compare(password,user.password);
        if(isSame)
        {
            return resp.status(400).json({success:false,message:"New password cannot be same as old password"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await adduser.findOneAndUpdate({emailid:emailid},{password:hashedPassword});
        await PasswordReset.deleteMany({ email:emailid });
        return resp.status(200).json({success:true,message:"Your Password updated successfully."});

    }
    catch(err)
    {
        console.log(err);
        return resp.status(500).json({ success: false, message: "Internal Server Error."});
    }
}

module.exports={SendResetOtp,VerifyOtp,ResetPassword};