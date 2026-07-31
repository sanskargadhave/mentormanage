const {StoreStudent}= require("../model/studentSchema");
const mongoose = require("mongoose");
const {StoreLecture,StoreAttendance}=require("../model/AttendanceSchema");
const StoreApplication =require("../model/applicationScema")
const bcrypt = require("bcryptjs");
const {StoreTestResult}=require("../model/testSchema");
const {getIO}=require("../socket");
const adduser=require("../model/userSchema");
const NotificationSchema=require("../model/notificationsScema");
const  {getCurrentSemester,isDateWithinRange}=require("../utils/semesterValidation.js");
const {generateStudentRecommendation}=require("../Services/AiRecommedationStudent.js");
const {LeaveAnalyticsAggregation,AttendanceAnalyticsAggregation}=require("../Services/StudentAggregationService.js")
// /add-student  URL
const StoreStudentDetails=async (req, res) => {
  try {
    const personaldetails = JSON.parse(req.body.personaldetails);
    const collagedetails = JSON.parse(req.body.collagedetails);
    const { aadharno } = personaldetails;
    const { rollno,mentorId } = collagedetails;
    const {emailid} = req.body;
    const imageurl = req.body.imageurl || "";
    const currentSemester=await getCurrentSemester();

    if (!currentSemester) { 
      return resp.status(400).json({ success: false, message: "No active semester found."});
    }

    const [ aadharnoexist, rollnoexist, emailidexist] = await Promise.all([
      StoreStudent.findOne({"personaldetails.aadharno":aadharno}),
      StoreStudent.findOne({"collagedetails.rollno":rollno}),
      StoreStudent.findOne({emailid})
    ]);
    
    if (aadharnoexist) {
      return res.status(400).json({success:false,
        message: "Aadhar No Already exists"
      });
    }
    else if(rollnoexist)
    {
      return res.status(400).json({success:false,
        message: "RollNo Already exists"
      });
    }

    else if (emailidexist)
    {
      return res.status(400).json({success:false,
        message: "This Email Already Used "
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password,10);
    const student = new StoreStudent({
      personaldetails,
      collagedetails,
      emailid:emailid,
      profileurl:imageurl,
      studentid:req.body.studentid,
      semesterId:currentSemester._id,

    });
    await student.save();
    

    await adduser.create({
      userid: student.studentid,
      userId:student._id,
      password: hashedPassword,
      emailid: req.body.emailid,
      profileurl:imageurl,
      role: "Student",
      active: false
    });

    
    const notification=await NotificationSchema.create({
      senderId:student._id,
      senderRole:"Student",
      receiver_Id:student.collagedetails.mentor,
      receiverid:student.collagedetails.mentorId,
      receiverRole:"Mentor",
      type:"student_added",
      message: `${student.personaldetails.name} has completed the registration process and is awaiting verification.`,
      title:"New Student Registration",
      entityType:"Student",
      entityId:student._id,
      priority:"normal",
      actionUrl:`/mentor/student/${student._id}`,
      metadata:{
        name:student.personaldetails.name,
        department:student.collagedetails.department,
        course:student.collagedetails.course,
        year:student.collagedetails.year,
        division:student.collagedetails.division,
        profileurl:imageurl,  
      },
      semesterId:currentSemester._id
    })
  

    const io=getIO();
    

    io.to("user_"+mentorId).emit("notification",notification);

    res.status(201).json({success:true,
      message: "Student added successfully"
    });

  } catch (err) {
    console.error("ERROR OCCURRED:");
    console.error(err);
    res.status(500).json({
      message: err.message,
      error: err.message,
      success:false
    });  }
};

// /api/students/count   URL
const StudentCounts= async (req, resp) => {
  try {
    const totalStudents = await StoreStudent.countDocuments(); 
    resp.json({ count: totalStudents });
  } catch (err) {
    resp.status(500).json({ error: err.message });
  }
};

// /api/serach-student/:lectureid   URL
const SearchStudent= async (req,resp)=>{
  try{
    const datas=await StoreLecture.findOne({lectureid:req.params.lectureid});
    const students=await StoreStudent.find({$and:[{"collagedetails.year":datas.Class},{"collagedetails.division":datas.division}]}).sort({"collagedetails.rollno":1});

    resp.status(200).json({success:true,students});
  }
  catch(err)
  {
    resp.status(500).json({success:false,message:err.message});
  }
};

// /api/get-studentdetails/:rollno
const GetStudentDetailsByRoll= async (req, resp) => {
  try {
    const rollno = Number(req.params.rollno);

    if (!Number.isInteger(rollno)) {
        return resp.status(400).json({
            success: false,
            message: "Invalid roll number. Only numbers are allowed."
        });
    }
    const {date,fromdate,todate}=req.query;
    
    const result = await StoreStudent.findOne({"collagedetails.rollno": rollno});
    if (!result) {
      return resp.status(404).json({ message: "Student Not Found" });
    }
    let datefilter={};

    if(date)
    {
      const start=new Date(date);
      const end=new Date(date);
      end.setHours(23,59,59,999);
      datefilter={$gte:start,$lte:end};
    }
    else if(fromdate && todate)
    {
      const start=new Date(fromdate);
      const end=new Date(todate);
      end.setHours(23,59,59,999);
      datefilter={$gte:start,$lte:end};
    }

    let matchstage={"attendance.rollno": rollno};

    if(Object.keys(datefilter).length>0)
    {
      matchstage.date=datefilter;
    }
    const data=await StoreAttendance.aggregate([
        { $unwind: "$attendance" },
        { 
          $match:matchstage
        },
        {
          $lookup: {
            from: "LectureDetails",  
            localField: "lectureid",
            foreignField: "lectureid",
            as: "lectureInfo"
          }
        },
        { $unwind: "$lectureInfo" },
        {
          $lookup: {
            from: "TeacherDetails",   
            localField: "lectureInfo.teacherid",
            foreignField: "_id",
            as: "teacherInfo"
          }
        },
        { $unwind: "$teacherInfo" },
        {
          $group: {
          _id: "$date",

          lecturecount: { $sum: 1 },
          presentcount: {
            $sum: {
              $cond: [
                { $eq: ["$attendance.status", "Present"] },1,0
              ]
            }
          },
          absentcount: {
            $sum: {
              $cond: [
                { $eq: ["$attendance.status", "Absent"] },1,0
              ]
            }
          },
          absentSubjects: {
            $addToSet: {
              $cond: [
                { $eq: ["$attendance.status", "Absent"] },
                {
                  subject: "$lectureInfo.subject",
                  teacher: "$teacherInfo.personaldetails.name"
                },"$$REMOVE"]
              }
            }
          }
          
        },
        {$project:{
          lecturecount:1,
          presentcount:1,
          absentcount:1,
          absentSubjects:1,
        }},
        { $sort: { _id: -1 } }   
    ])
    resp.status(200).json({
      student: result,
      attendance: data
    });
    
  } 
  catch (err) {
    resp.status(500).json({ message: err.message });
  }
};

const GetStudent= async (req,resp)=>{
  try{
    const {Class,division,department,course}=req.query;
    const students=await StoreStudent.find({"collagedetails.year":Class,"collagedetails.division":division,"collagedetails.department":department,"collagedetails.course":course});
    const assigndata=await StoreStudent.aggregate([
      {$match:{"collagedetails.department":department,"collagedetails.course":course,"collagedetails.year":Class}},
      {$lookup:{
          from:"MentorDetails",
          localField:"collagedetails.mentor",
          foreignField:"_id",
          as:"MentorDetails"
        }
      },
      {$unwind:"$MentorDetails"},
      {$group:{
        _id:{
          mentor:"$collagedetails.mentor",
          division:"$collagedetails.division"
        },
        from:{$min:"$collagedetails.rollno"},
        to:{$max:"$collagedetails.rollno"},
        mentorname:{$first:"$MentorDetails.personaldetails.name"}
        }
      },
      {$project:{
        _id:0,
        division:"$_id.division",
        from:1,
        to:1,
        mentorname:1
      }},
      {$sort:{"division":1}}
    ])
    resp.status(200).json({students:students,assigndata:assigndata});
  }
  catch(err)
  {
    resp.status(500).json({message:err.message});
  }
};


const giveApprove = async (req,resp)=>{
      try{
          
          await StoreStudent.findByIdAndUpdate(req.params.id,{registrationStatus:"Approved",isactive:true});
          await adduser.updateOne({userid:req.params.studentid},{$set:{active:true}});
          resp.status(200).json({success:true,message:"Student Approved"});
      }
      catch(err)
      {
        resp.status(500).json({success:false,message:err.message});
        console.log(err.message);
      }
}

const giveReject = async (req,resp)=>{
      try{
          
          await StoreStudent.findByIdAndUpdate(req.params.id,{registrationStatus:"Rejected"});

          resp.status(200).json({success:true,message:"Student Rejected "});
      }
      catch(err)
      {
        resp.status(500).json({success:false,message:err.message});
        console.log(err.message);
      }
}
const giveread = async (req,resp)=>{
  try{
      await NotificationSchema.findByIdAndUpdate(req.params.id,{
        isRead:true,
        readAt:new Date()
      });
      resp.status(200).json({success:true,message:"Update Successfuly"})
  }
  catch(err)
  {
    return resp.status(500).json({success:false,message:err.message});
  }
}
const getMentordetails = async (req, resp) => {
  try {

    const { studentid } = req.params;

    const StudentDetails = await StoreStudent
      .findOne({ studentid: studentid })
      .populate("collagedetails.mentor");

    if (!StudentDetails) {
      return resp.status(404).json({success:false,
        message: "Record Not Found"
      });
    }

    resp.status(200).json({success:true,
      StudentDetails,
      MentorDetails: StudentDetails.collagedetails.mentor
    });

  } catch (err) {

    resp.status(500).json({
      success:false,message: err.message
    });

  }
};

const sendApplication = async (req, resp) => {
  try {
    const io = getIO();
    const {leaveType,fromDate,toDate,reason,senderId,receiver_Id,
      receiverid,receiverRole,type,certificateUrl,studentName}=req.body;
      const currentSemester=await getCurrentSemester();
      if (!currentSemester) { 
        return resp.status(400).json({ success: false, message: "No active semester found."});
      }
      if(!isDateWithinRange(fromDate,currentSemester.attendanceStartDate,currentSemester.attendanceEndDate)){
        return resp.status(400).json({ success: false, message: "You can Only Apply in this Semester "});

      }
    const existingApplication = await StoreApplication.findOne({
        senderId,
        type:"leave_request",
        "data.fromDate": { $lte: toDate },
        "data.toDate": { $gte: fromDate }
    });

    if(existingApplication)
    {
      return resp.status(400).json({success:false,message:`you have already applied from ${fromDate} To ${toDate}`});
    }
    const totalDays =
      Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24) ) + 1;

    const storeapplication=await StoreApplication.create({
        senderId:senderId,
        receiver_Id:receiver_Id,
        receiverRole:"Mentor",
        type:"leave_request",
        message: `${studentName} requested ${leaveType}  from ${fromDate} to ${toDate}.`,
        data:{
          name:studentName,
          leaveType:leaveType,
          fromDate:fromDate,
          toDate:toDate,
          reason:reason,
          certificateUrl:certificateUrl,
          totalDays:totalDays
        },
        semesterId:currentSemester._id
      });

    const notification=await NotificationSchema.create({
        senderId:senderId,
        senderRole:"Student",
        receiver_Id:receiver_Id,
        receiverid:receiverid,
        receiverRole:"Mentor",
        type:"leave_request",
      message: `${studentName} requested ${leaveType} leave from ${fromDate} to ${toDate}.`,
      title:"New Leave Request",
      entityType:"Leave",
      entityId:storeapplication._id,
      priority:"high",
      actionUrl:`/mentor/leave/${storeapplication._id}`,
      metadata:{
        applicationid:storeapplication._id,
         studentId:senderId,
        leaveType:leaveType,
        fromDate:fromDate,
        toDate:toDate,
        reason:reason,
        certificateUrl:certificateUrl,
        totalDays:totalDays
      },
      semesterId:currentSemester._id
    })

    io.to("user_" +receiverid).emit("notification", notification);

    resp.status(200).json({success:true,message:"Your Application Has been Send For Your Mentor"});

  } catch (err) {
    console.log(err.message);

    resp.status(500).json({ success:false,
      message: err.message
    });
  }
};


const givePermission = async (req, resp) => {

  try {

    const { permission, applicationid } = req.params;

    if (
      permission !== "Approved" &&
      permission !== "Rejected"
    ) {
      return resp.status(400).json({
        message: "Invalid permission value"
      });
    }

    const updatenoti = await NotificationSchema.updateOne(
      {
        "data.applicationid":
          new mongoose.Types.ObjectId(applicationid)
      },
      {
        $set: {
          "data.status": permission
        }
      }
    );

    if (updatenoti.matchedCount === 0) {

      return resp.status(404).json({success:false,
        message: "Application Not Found"
      });
    }

    resp.status(200).json({success:true,
      message: `Application ${permission}`
    });

  }
  catch (err) {

    console.log(err.message);

    resp.status(500).json({
      message: err.message
    });
  }
};

const getapplication = async (req,resp)=>{
  try{
      
      const {id} = req.params;
      const _id = await StoreStudent.findOne({studentid:id},"_id");
      const applications = await NotificationSchema.find({senderId:_id,type:"Leave_application"}).sort({createdAt:-1});
        if (applications.length === 0) {
          return resp.status(404).json({ success:false,message: "Applications Not Found"});
        }
      resp.status(200).json({success:true,applications});
  }
  catch(err)
  {
    console.log(err.message);
    resp.status(500).json({success:false,message:err.message});
  }
}
const getapplicationById = async (req,resp)=>{
  try{
      
      const application = await StoreApplication.findById(req.params.id);
      const student = await StoreStudent.findById(application.senderId);

      resp.status(200).json({success:true,application,student});
  }
  catch(err)
  {
    console.log(err.message);
    resp.status(500).json({success:false,message:err.message});
  }
}

const getstudentsummery = async (req,resp)=>{
  try{
      const {id}=req.params;
      const studentdetails = await StoreStudent.findOne({studentid:id}).select("-password -__v");

      const testdetails=await StoreTestResult.aggregate([
        {
          $unwind: "$students"
        },
        {
          $match: {
            department: "ComputerScience",
            course: "BSC [ECS]",
            year: "second",
            division: "A",
            "students.studentid": ObjectId("698b1f107e521be9b91147f5"),
            date: {
                $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
                $lte: new Date()
            }
          }
        },
        {
          $project: {
            _id: 0,
            date: 1,
            totalmarks: 1,
            passingmarks: 1,
            marks: "$students.marks",
            status: "$students.status"
          }
        }
      ]);

      const testsummery =await StoreTestResult.aggregate([
        {
          $unwind: "$students"
        },
        {
          $match: {
            department: "ComputerScience",
            course: "BSC [ECS]",
            year: "second",
            division: "A",
            "students.studentid": ObjectId("698b1f107e521be9b91147f5"),
            date: {
              $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
              $lte: new Date()
            }
          }
        },  
        {
          $group: {
            _id: null,
            totalTests: { $sum: 1 },
            averageMarks: { $avg: "$students.marks" },
            passedTests: {
              $sum: {
                $cond: [
                  { $eq: ["$students.status", "Pass"] },
                  1,0
                ]
              }
            }
          }
        }
      ])
      
      

  }
  catch(err)
  {

  }
}
const getStudentDetails = async(req,res)=>{
    try{
      
      const student = await StoreStudent.findById(req.params.id)
          .populate("collagedetails.mentor");

      res.status(200).json({success:true,student});
    }
    catch(err)
    {
      res.status(500).json({success:false,message:err.message});
    }
}

const getstudentAnalytics = async (req,resp)=>{
  try{
    const {id}=req.params;

    const studentId = new mongoose.Types.ObjectId(id);
    const student = await StoreStudent.findById(studentId);
    
    if(!id) return resp.status(404).json({success:false,message:"Required Valid Id "})
     const currentSemester=await getCurrentSemester();
   
    if(!currentSemester)  return resp.status(404).json({success:false,message:"Not Found Current Semester"});

    const [result,LeaveStatus]=await Promise.all([
      AttendanceAnalyticsAggregation(studentId,currentSemester),
      LeaveAnalyticsAggregation(studentId,currentSemester)
    ])

    const analyticsData = {
        SubjectTrends: result[0]?.SubjectTrends || [],
        AttendanceDistribution:result[0]?.AttendanceDistribution?.[0] || {},
        AttendanceTrends:result[0]?.AttendanceTrends || [],
        LeaveStatus:LeaveStatus[0] || {},
        AttendanceHeatmap:result[0]?.AttendanceHeatmap||[],
        currentSemester:currentSemester||{},
      };
     
      const Recommendation=await generateStudentRecommendation(analyticsData);

      const FinalanalyticsData = {
        SubjectTrends: result[0]?.SubjectTrends || [],
        AttendanceDistribution:result[0]?.AttendanceDistribution?.[0] || {},
        AttendanceTrends:result[0]?.AttendanceTrends || [],
        LeaveStatus:LeaveStatus[0] || {},
        AttendanceHeatmap:result[0]?.AttendanceHeatmap||[],
        currentSemester:currentSemester||{},
        Recommendation:Recommendation||{}
      };
      
    console.log(FinalanalyticsData);
    return resp.status(200).json({ success: true,FinalanalyticsData});
  }
  catch(err)
  {
    resp.status(200).json({success:false,message:err.message});
  }
}
module.exports={GetStudentDetailsByRoll,SearchStudent,StudentCounts,
  StoreStudentDetails,GetStudent,giveApprove,giveReject,
  getMentordetails,sendApplication,givePermission,getapplication,getapplicationById,getStudentDetails,giveread,getstudentAnalytics };