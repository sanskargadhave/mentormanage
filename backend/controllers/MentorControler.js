const {StoreLecture,StoreAttendance}=require("../model/AttendanceSchema");
const {StoreStudent,StoreMentor,StoreTeacher}= require("../model/studentSchema");
const adduser=require("../model/userSchema");
const NotificationSchema=require("../model/notificationsScema");
const StoreApplication=require("../model/applicationScema");
const bcrypt = require("bcryptjs");
const {getIO}=require("../socket");
const  {getCurrentSemester}=require("../utils/semesterValidation.js")
const {MentorAnalyticAggregation}=require("../Services/MentorAggregationService.js");
const mongoose =require("mongoose");
const MentorCount= async (req, resp) => {
  try {
    const totalMentor = await StoreMentor.countDocuments(); 
    resp.json({ success:true,count: totalMentor });
  } catch (err) {
    resp.status(500).json({ success:false,error: err.message });
  }
};


//    /api/add-mentor URL   POST
const AddMentor= async (req,res)=>{
  try{
    const personaldetails = JSON.parse(req.body.personaldetails);
    const professionaldetails = JSON.parse(req.body.professionaldetails);
    const contactdetails = JSON.parse(req.body.contactdetails);
    const currentSemester=await getCurrentSemester();

    if (!currentSemester) { 
      return resp.status(400).json({ success: false, message: "No active semester found."});
    }
    const {emailid}=contactdetails;
    const {mobileno}=contactdetails;
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

    const hashedPassword = await bcrypt.hash(req.body.password,10);
      const mentor = new StoreMentor({
        personaldetails,
        professionaldetails,
        contactdetails,
        profileurl:imageurl,
        semesterId:currentSemester._id
      });
      
    await mentor.save();

    await adduser.create({
      userId:mentor._id,
      userid: mentor.mentorId,
      password: hashedPassword,
      emailid: emailid,
      role: "Mentor",
      profileurl:imageurl,
      
    });

    const notification=await NotificationSchema.create({
      senderId:mentor._id,
      senderRole:"Mentor",
      receiver_Id:"697f16cd19432806852e9a24",
      receiverid:"AD-02012006-001",
      receiverRole:"Admin",
      type:"mentor_added",
      message:`${mentor.personaldetails.name} has completed the registration process and is awaiting verification.`,
      title:"New Mentor Registration",
      entityType:"Mentor",
      entityId:mentor._id,
      priority:"normal",
      actionUrl:`/admin/mentor/${mentor._id}`,
      metadata:{
        id:mentor.mentorId,
        name:mentor.personaldetails.name,
        department:mentor.professionaldetails.department,
        qualification:mentor.professionaldetails.qualification,
        exprience:mentor.professionaldetails.exprience,
        mobileno:mentor.contactdetails.mobileno,
        profileurl:imageurl,
      },
      semesterId:currentSemester._id
    })
    const io=getIO();
    console.log("Sending notification");

    io.to("user_AD-02012006-001").emit("notification",notification);

    res.status(201).json({success: true,message:"Mentor Add Sucessfully",mentorId:mentor.mentorId});
  }
  catch(err)
  {
    res.status(500).json({success: false,error:err.message});
  }
};

//    /api/mentor-login  URL Get

const MentorLogin = async (req, resp) => {
  try {
    
    const { emailid, password } = req.body;

    const mentor = await StoreMentor.findOne({ "contactdetails.emailid":emailid}); 
    if (!mentor) {
      return resp.status(404).json({ message: "Mentor Not Found" });
    }

    const match = await bcrypt.compare(password, mentor.password);
    if (!match) {
      return resp.status(401).json({ message: "Password Doesn't Match" });
    }

    resp.status(200).json({ message: "Login Success Welcome Mentor" ,mentor});

  } catch (err) {
    resp.status(500).json({ message: err.message });

  }
};

const GetMentors= async (req,resp)=>{
  try{
    const Mentors=await StoreMentor.find();
    resp.status(200).json({success:true,Mentors});
  }
  catch(err)
  {
    resp.status(500).json({success:false,message:err.message});
  }
}

const AssignMentor = async (req, resp) => {
  try {
    const { from, to, mentorid } = req.body;
    const fromNo = Number(from);
    const toNo = Number(to);
    const id = await StoreMentor.findOne(
      { mentorId: mentorid },
      "_id"
    );

    if (!id) {
      return resp.status(404).json({ message: "Mentor not found" });
    }

    const alreadyAssigned = await StoreStudent.findOne({
      "collagedetails.rollno": { $gte: fromNo, $lte: toNo },
      "collagedetails.mentor": { $ne: null }
    });

    if (alreadyAssigned) {
      return resp.status(400).json({
        message: `Roll No ${from} - ${to} Mentor Already Assigned`
      });
    }

    await StoreStudent.updateMany(
      { "collagedetails.rollno": { $gte: fromNo, $lte: toNo } },
      { $set: { "collagedetails.mentor": id._id } }
    );

    resp.status(200).json({ message: "Mentor Assigned Successfully" });

  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};


const getMentorDetails = async(req,res)=>{
  try{
    const mentor = await StoreMentor.findById(req.params.id);
    res.status(200).json({success:true,mentor});
  }
  catch(err)
  {
    res.status(500).json({success:false,message:err.message});
  }

    
}

const giveApproveMentor = async (req,resp)=>{
      try{
          
          await StoreMentor.findByIdAndUpdate(req.params.id,{registrationStatus:"Approved",isactive:true});
          await adduser.updateOne({userid:req.params.mentorId},{$set:{active:true}});
          resp.status(200).json({success:true,message:"Mentor Approved"});
      }
      catch(err)
      {
        resp.status(500).json({success:false,message:err.message});
        
      }
}

const giveRejectMentor = async (req,resp)=>{
      try{
          await StoreMentor.findByIdAndUpdate(req.params.id,{registrationStatus:"Rejected"});
          resp.status(200).json({success:true,message:"Mentor Rejected "});
      }
      catch(err)
      {
        resp.status(500).json({success:false,message:err.message});
      }
}

const giveApplicationApprove=async (req,resp)=>{
  try{
    await StoreApplication.findByIdAndUpdate(req.params.id,{status:"Approve",read:true});
    resp.status(200).json({success:true,message:"Leave Are Approved By You"});
  }
  catch(err)
  {
    resp.status(500).json({success:false,message:err.message});
  }

}
const giveApplicationReject=async (req,resp)=>{
  try{
    await StoreApplication.findByIdAndUpdate(req.params.id,{status:"Reject",read:true});
    resp.status(200).json({success:true,message:"Leave Are Rejected By You"});
  }
  catch(err)
  {
    resp.status(500).json({success:false,message:err.message});
  }

}

const getmentorAnalytics=async (req,resp)=>{
  try{
      const {id}=req.params;
      const mentorId = new mongoose.Types.ObjectId(id);
      const assignedstudentList=await StoreStudent.find({"collagedetails.mentor":mentorId},{_id:1});
  
      const currentSemester=await getCurrentSemester();
      if (!currentSemester) { 
        return resp.status(400).json({ success: false, message: "No active semester found."});
      }
      const result=await MentorAnalyticAggregation(currentSemester,assignedstudentList,mentorId);
      
      const analyticsData={
        LectureActivity:result[0]?.LectureActivity || [],
        MentorOverview:result[0]?.MentorOverview || [],
        StudentsBelow75:result[0]?.StudentsBelow75 || [],
        AverageClassPerformance:result[0]?.AverageClassPerformance || [],
        AttendanceTrends:result[0]?.AttendanceTrends || [],
        StudentAttendanceDistribution: result[0]?.StudentAttendanceDistribution || [],
      }
      console.log(analyticsData)
      resp.status(200).json({success:true,analyticsData});

  }
  catch(err)
  {
    resp.status(500).json({success:false,message:err.message});
  }
}
module.exports={MentorCount,AddMentor,MentorLogin,GetMentors,
              AssignMentor,getMentorDetails,giveApproveMentor,
              giveRejectMentor,giveApplicationApprove,giveApplicationReject,getmentorAnalytics};

