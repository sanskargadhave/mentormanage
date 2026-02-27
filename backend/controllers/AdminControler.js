const readadmin = require("../model/adminSchema");
const {StoreStudent, StoreMentor, StoreTeacher}= require("../model/studentSchema");
const bcrypt = require("bcryptjs");
//  /api/admin-login  URL POST 
const AdminLogin=async (req, resp) => {
  try {
    const { emailid, password } = req.body;

    const admin = await readadmin.findOne({ emailid }); 
    if (!admin) {
      return resp.status(404).json({ message: "Admin Not Found" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return resp.status(401).json({ message: "Password Doesn't Match"});
    }

    resp.status(200).json({ message: "Login Success.... Welcome Admin",admin});

  } catch (err) {
    console.error(err);
    resp.status(500).json({ message: "Server Error" });
  }
};

const UserCounts=async (req,resp)=>{
  try{
    const totalStudents = await StoreStudent.countDocuments();
    const totalMentors= await StoreMentor.countDocuments();
    const totalteachers= await StoreTeacher.countDocuments();
    resp.status(200).json({totalStudents:totalStudents,totalMentors:totalMentors,totalteachers:totalteachers});
  }
  catch(err)
  {
    resp.status(500).json({message:err.message});
  }
}
module.exports={AdminLogin,UserCounts};