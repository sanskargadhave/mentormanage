const {StoreLecture,StoreAttendance}=require("../model/AttendanceSchema");
const {StoreStudent,StoreMentor,StoreTeacher}= require("../model/studentSchema");
const NotificationSchema=require("../model/notificationsScema");
 
const bcrypt = require("bcryptjs");
const adduser=require("../model/userSchema");
const {getIO}=require("../socket");
const  {getCurrentSemester}=require("../utils/semesterValidation.js")

//  /api/add-teacher  POST
const AddTeacher = async(req,res)=>{
  try{
    const currentSemester=await getCurrentSemester();

    if (!currentSemester) { 
      return resp.status(400).json({ success: false, message: "No active semester found."});
    }

    const personaldetails = JSON.parse(req.body.personaldetails);
    const professionaldetails = JSON.parse(req.body.professionaldetails);
    const contactdetails = JSON.parse(req.body.contactdetails);

    const {emailid,mobileno}=contactdetails;
   const imageurl = req.body.imageurl || "";

    const emailidexist=await StoreMentor.findOne({"contactdetails.emailid":emailid});
    const mobilenoexist=await StoreMentor.findOne({"contactdetails.mobileno":mobileno});
    if(emailidexist)
    {
      return res.status(400).json({success: false,message:"Your Emailid  Is  Already Exists"});
    }
    else if(mobilenoexist)
    {
      return res.status(400).json({success: false,message:"Your Mobile No Is Already Exists"})
    }


    req.body.password = await bcrypt.hash(req.body.password, 10);
    const teacher=new StoreTeacher({personaldetails,
        professionaldetails,
        contactdetails,
        profileurl:imageurl,
        semesterId:currentSemester._id
      });

    await teacher.save();

    await adduser.create({
      userId:teacher._id,
      userid: teacher.TeacherId,
      password: req.body.password,
      emailid: emailid,
      role: "Teacher",
      profileurl:imageurl,
    });

    const notification=await NotificationSchema.create({
          senderId:teacher._id,
          senderRole:"Teacher",
          receiver_Id:"697f16cd19432806852e9a24",
          receiverid:"AD-02012006-001",
          receiverRole:"Admin",
          type:"teacher_added",
          message:`${teacher.personaldetails.name} has completed the registration process and is awaiting verification.`,
          title:"New Teacher Registration",
          entityType:"Teacher",
          entityId:teacher._id,
          priority:"normal",
          actionUrl:`/admin/teacher/${teacher._id}`,
          metadata:{
            id:teacher.TeacherId,
            name:teacher.personaldetails.name,
            department:teacher.professionaldetails.department,
            qualification:teacher.professionaldetails.qualification,
            exprience:teacher.professionaldetails.exprience,
            mobileno:teacher.contactdetails.mobileno,
            profileurl:imageurl,
          },
          semesterId:currentSemester._id
        })
        const io=getIO();
        console.log("Sending notification");
    
        io.to("user_AD-02012006-001").emit("notification",notification);
    res.status(201).json({success: true,message:"Teacher Add Sucessfully",teacherId:teacher.TeacherId});
  }
  catch(err)
  {
    res.status(500).json({success: false,error:err.message});
    console.log(err.message);
  }
};

//  /api/getteacher  GET
const GetTeacher = async (req,resp)=>{
  try{
    const teacher=await StoreTeacher.find({},"TeacherId personaldetails.name");
    resp.status(200).json({success: true,teacher});
  }
  catch(err)
  {
    resp.status(500).json({success: false,message:err.message});
  }
};

const getTeacherDetails = async(req,res)=>{
    try{
      const teacher = await StoreTeacher.findById(req.params.id)
      res.status(200).json({success:true,teacher});
    }
    catch(err)
    {
      res.status(500).json({success:false,message:err.message});
    }
    
}

const giveApproveTeacher = async (req,resp)=>{
      try{
          
          await StoreTeacher.findByIdAndUpdate(req.params.id,{registrationStatus:"Approved",isactive:true});
          await adduser.updateOne({userid:req.params.TeacherId},{$set:{active:true}});
          resp.status(200).json({success:true,message:"Teacher Approved"});
      }
      catch(err)
      {
        resp.status(500).json({success:false,message:err.message});
        
      }
}

const giveRejectTeacher = async (req,resp)=>{
      try{
          
          await StoreMentor.findByIdAndUpdate(req.params.id,{registrationStatus:"Rejected"});

          resp.status(200).json({success:true,message:"Teacher Rejected "});
      }
      catch(err)
      {
        resp.status(500).json({success:false,message:err.message});
        
      }
}

module.exports={AddTeacher,GetTeacher,getTeacherDetails,giveApproveTeacher,giveRejectTeacher};