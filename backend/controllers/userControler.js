const adduser =require("../model/userSchema");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const UAParser =require("ua-parser-js");  
const {UserActivity}=require("../model/UserActitivityScema");
const userlogin = async (req, resp) => {
  try {
    const parser=new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();
    const browser=result.browser.name;
    const operatingSystem=result.os.name;
    const deviceType=result.device.type;

    const { emailid, password } = req.body;

    const user = await adduser.findOne({ emailid });
    if (!user) 
    {
      return resp.status(401).json({ success:false,message: "Emailid or Password Incorrect",islogin: false});
    }
    if (!user.active) 
    {
      return resp.status(403).json({ success:false,message: "Oops! You Are Not Approved"});
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match)
    {
      return resp.status(401).json({ success:false,message: "Emailid or Password Incorrect", islogin: false });
    }

    await UserActivity.create({
      userId: user.userId,
      activityType: "LOGIN",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      browser,
      operatingSystem,
      deviceType,
      status: "SUCCESS",
      
    });
   
    const token = jwt.sign(
      { userid: user.userid, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    
    const safeUser = {
      _id:user.userId,
      id: user.userid,
      emailid: user.emailid,
      role: user.role,
      profileurl:user.profileurl
    };
    
    resp.status(200).json({success:true,message: `Login Success Welcome ${user.role}`, token: token, islogin: true, user: safeUser });

  } 
  catch (err) 
  {
    console.log(err.message);
    resp.status(500).json({ success:false,message: err.message });
  }
};

module.exports={userlogin};