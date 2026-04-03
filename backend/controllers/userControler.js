const adduser =require("../model/userSchema");
const bcrypt = require("bcryptjs");
const userlogin=async (req,resp)=>{
    try{
        const {emailid,password}=req.body;
        const user=await adduser.findOne({emailid});
        
        console.log("password from frontend:",password);
        if(!user)
        {
            return resp.status(404).json({message:"Emailid or Password Incorrect",islogin:false});
        }
        if(user.active===false)
        {
            return resp.status(404).json({message:"Oops ! You Have Banned From Mentor"})
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match)
        {
            return resp.status(404).json({message:"Emailid or Password Incorrect",islogin:false});
        }
        resp.status(200).json({message:`Login Success Welcome ${user.role} `,islogin:true,userdetails:user})
    }
    catch(err)  
    {
        resp.status(500).json({message:err.message});
        console.log(err.message);
    }
}

module.exports={userlogin};