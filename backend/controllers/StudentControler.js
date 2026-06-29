const {StoreStudent}= require("../model/studentSchema");
const mongoose = require("mongoose");
const {StoreLecture,StoreAttendance}=require("../model/AttendanceSchema");
const StoreApplication =require("../model/applicationScema")
const bcrypt = require("bcryptjs");
const {StoreTestResult}=require("../model/testSchema");
const {getIO}=require("../socket");
const adduser=require("../model/userSchema");
const NotificationSchema=require("../model/notificationsScema");
// /add-student  URL
const StoreStudentDetails=async (req, res) => {
  try {
    const personaldetails = JSON.parse(req.body.personaldetails);
    const collagedetails = JSON.parse(req.body.collagedetails);
    const { aadharno } = personaldetails;
    const { rollno,mentorId } = collagedetails;
    const {emailid} = req.body;
    const imageurl = req.body.imageurl || "";

    const aadharnoexist = await StoreStudent.findOne({"personaldetails.aadharno": aadharno});
    const rollnoexist = await StoreStudent.findOne({ "collagedetails.rollno": rollno });
    const emailidexist= await StoreStudent.findOne({"emailid":emailid});
    if (aadharnoexist) {
      return res.status(400).json({
        message: "Aadhar No Already exists"
      });
    }
    else if(rollnoexist)
    {
      return res.status(400).json({
        message: "RollNo Already exists"
      });
    }

    else if (emailidexist)
    {
      return res.status(400).json({
        message: "This Email Already Used "
      });
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);
    const student = new StoreStudent({
      personaldetails,
      collagedetails,
      emailid:emailid,
      password: req.body.password,
      profileurl:imageurl,
      studentid:req.body.studentid,
      isactive:true
    });
    await student.save();


    await adduser.create({
      userid: student.studentid,
      password: req.body.password,
      emailid: req.body.emailid,
      profileurl:imageurl,
      role: "Student",
      active: false
    });


    await NotificationSchema.create({
      senderId:student._id,
      receiver_Id:student.collagedetails.mentor,
      receiverid:student.collagedetails.mentorId,
      receiverRole:"Mentor",
      type:"student_added",
      message:`${student.personaldetails.name}  Registered`,
      data:{
        id:student.studentid,
        name:student.personaldetails.name,
        rollno:student.collagedetails.rollno,
        department:student.collagedetails.department,
        course:student.collagedetails.course,
        year:student.collagedetails.year,
        division:student.collagedetails.division,
        parentno:student.personaldetails.parentno,
        mobileno:student.personaldetails.mobileno,
        profileurl:imageurl,
      }
    })




    const io=getIO();
    console.log("Sending notification");

    io.to("user_"+mentorId).emit("notification",{
      receiverid: mentorId,
      type:"student_added",
      message:`${student.personaldetails.name} Registered`,
      createdAt:new Date(),
      data:{
        id:student.studentid,
        name:student.personaldetails.name,
        rollno:student.collagedetails.rollno,
        department:student.collagedetails.department,
        course:student.collagedetails.course,
        year:student.collagedetails.year,
        division:student.collagedetails.division,
        parentno:student.personaldetails.parentno,
        mobileno:student.personaldetails.mobileno,
        profileurl:imageurl,
      }
});

    res.status(201).json({
      message: "Student added successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to add student",
      error: err.message
    });
    console.log(err.message);
  }
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

    resp.status(200).json(students);
  }
  catch(err)
  {
    resp.status(500).json({message:err.message});
  }
};

// /api/get-studentdetails/:rollno
const GetStudentDetailsByRoll= async (req, resp) => {
  try {
    const rollno = parseInt(req.params.rollno);
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
          const {studentid}=req.params;
          await StoreStudent.updateOne({studentid:studentid},{$set:{isactive:true}});
          resp.status(200).json({message:"Student Approved"});
      }
      catch(err)
      {
        resp.status(500).json({message:err.message});
        console.log(err.message);
      }
}

const giveReject = async (req,resp)=>{
      try{
          const {studentid}=req.params;
          await StoreStudent.updateOne({studentid:studentid},{$set:{isactive:false}});
          await adduser.updateOne({userid:studentid},{$set:{active:false}});
          resp.status(200).json({message:"Student Rejected "});
      }
      catch(err)
      {
        resp.status(500).json({message:err.message});
        console.log(err.message);
      }
}

const getMentordetails = async (req, resp) => {
  try {

    const { studentid } = req.params;

    const StudentDetails = await StoreStudent
      .findOne({ studentid: studentid })
      .populate("collagedetails.mentor");

    if (!StudentDetails) {
      return resp.status(404).json({
        message: "Record Not Found"
      });
    }

    resp.status(200).json({
      StudentDetails,
      MentorDetails: StudentDetails.collagedetails.mentor
    });

  } catch (err) {

    resp.status(500).json({
      message: err.message
    });

  }
};

const sendApplication = async (req, resp) => {
  try {
    const io = getIO();
    const {leaveType,fromDate,toDate,reason,senderId,receiver_Id,
      receiverid,receiverRole,type,message,certificateUrl}=req.body;

    const existingApplication = await StoreApplication.findOne({ senderId: senderId, type: "Leave_application",

      $or: [
        { "data.fromDate": { $lte: toDate }, "data.toDate": { $gte: fromDate }}
      ]
    });

    if(existingApplication)
    {
    
      return resp.status(400).json({message:`you have already applied from ${fromDate} To ${toDate}`});
    }
  
    const totalDays =
      Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24) ) + 1;
    
      const applicationid = new mongoose.Types.ObjectId();
    
      const notificationData = {
      senderId:senderId,
      receiver_Id:receiver_Id,
      receiverid:receiverid,
      receiverRole:"Mentor",
      type:"Leave_application",
      message:message,
      data: {
        applicationid:applicationid,
        leaveType:leaveType,
        fromDate:fromDate,
        toDate:toDate,
        reason:reason,
        certificateUrl:certificateUrl,
        status:"Pending",
        totalDays:totalDays
      },
    };
    
    const storeapplication=await StoreApplication.create(notificationData);
    const storedNotification=await NotificationSchema.create(notificationData)
    io.to("user_" +receiverid)
      .emit("notification", storedNotification);
    resp.status(200).json({message:"Your Application Has been Send For Your Mentor"});

  } catch (err) {
    console.log(err.message);

    resp.status(500).json({ 
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

      return resp.status(404).json({
        message: "Application Not Found"
      });
    }

    resp.status(200).json({
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
          return resp.status(404).json({ message: "Applications Not Found"});
        }
      resp.status(200).json({applications});
  }
  catch(err)
  {
    console.log(err.message);
    resp.status(500).json({message:err.message});
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

module.exports={GetStudentDetailsByRoll,SearchStudent,StudentCounts,
  StoreStudentDetails,GetStudent,giveApprove,giveReject,
  getMentordetails,sendApplication,givePermission,getapplication};