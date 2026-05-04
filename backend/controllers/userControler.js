const adduser =require("../model/userSchema");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const userlogin = async (req, resp) => {
  try {
    const { emailid, password } = req.body;

    const user = await adduser.findOne({ emailid });
    if (!user) 
    {
      return resp.status(401).json({ message: "Emailid or Password Incorrect",islogin: false});
    }
    if (!user.active) 
    {
      return resp.status(403).json({ message: "Oops! You have been banned"});
    }

   
    const match = await bcrypt.compare(password, user.password);
    if (!match)
    {
      return resp.status(401).json({ message: "Emailid or Password Incorrect", islogin: false });
    }

   
    const token = jwt.sign(
      { userid: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    
    const safeUser = {
      id: user._id,
      emailid: user.emailid,
      role: user.role
    };

    resp.status(200).json({ message: `Login Success Welcome ${user.role}`, token: token, islogin: true, user: safeUser });

  } 
  catch (err) 
  {
    console.log(err.message);
    resp.status(500).json({ message: err.message });
  }
};

module.exports={userlogin};