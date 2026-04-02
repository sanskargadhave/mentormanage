const {StoreLecture,StoreAttendance}=require("../model/AttendanceSchema");
const {StoreStudent,StoreMentor,StoreTeacher}= require("../model/studentSchema");
const bcrypt = require("bcryptjs");
const adduser=require("../model/userSchema");


//  /api/add-teacher  POST
const AddTeacher = async(req,res)=>{
  try{
    const {emailid}=req.body.contactdetails;
    const {mobileno}=req.body.contactdetails;

    const emailidexist=await StoreMentor.findOne({"contactdetails.emailid":emailid});
    const mobilenoexist=await StoreMentor.findOne({"contactdetails.mobileno":mobileno});
    if(emailidexist)
    {
      return res.status(400).json({message:"Your Emailid  Is  Already Exists"});
    }
    else if(mobilenoexist)
    {
      return res.status(400).json({message:"Your Mobile No Is Already Exists"})
    }


    req.body.password = await bcrypt.hash(req.body.password, 10);
    const teacher=new StoreTeacher(req.body);
    await teacher.save();

    await adduser.create({
      userid: teacher.TeacherId,
      password: req.body.password,
      emailid: emailid,
      role: "Teacher",
      active: true
    });
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