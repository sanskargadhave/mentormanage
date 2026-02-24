const {StoreLecture,StoreAttendance}=require("../model/AttendanceSchema");
const {StoreStudent,StoreMentor,StoreTeacher}= require("../model/studentSchema");
const bcrypt = require("bcryptjs");


//  /api/add-teacher  POST
const AddTeacher = async(req,res)=>{
  try{
    const {emailid}=req.body.contactdetails;
    const {mobileno}=req.body.contactdetails;

    const exist=await StoreTeacher.findOne({$or:[{"contactdetails.emailid":emailid},{"contactdetails.mobileno":mobileno}]});
    if(exist)
    {
      return res.status(400).json({message:"Email or Mobile No Already Exists...."});
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);
    const teacher=new StoreTeacher(req.body);
    await teacher.save();
    res.status(201).json({message:"Teacher Add Sucessfully",teacherId:teacher.TeacherId});
  }
  catch(err)
  {
    res.status(500).json({error:err.message});
  }
};

//  /api/getteacher  GET
const GetTeacher = async (req,resp)=>{
  try{
    const teacher=await StoreTeacher.find({},"TeacherId personaldetails.name");
    resp.status(200).json(teacher);
  }
  catch(err)
  {
    resp.status(500).json({message:err.message});
  }
};


module.exports={AddTeacher,GetTeacher};