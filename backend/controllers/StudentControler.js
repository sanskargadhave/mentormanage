const {StoreStudent}= require("../model/studentSchema");
const {StoreLecture,StoreAttendance}=require("../model/AttendanceSchema");
const bcrypt = require("bcryptjs");
const {getIO}=require("../socket");
const adduser=require("../model/userSchema");
const NotificationSchema=require("../model/notificationsScema");
// /add-student  URL
const StoreStudentDetails=async (req, res) => {
  try {
    const { aadharno } = req.body.personaldetails;
    const { rollno,mentorId } = req.body.collagedetails;
    const {emailid} = req.body;
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
    const student = new StoreStudent(req.body);
    await student.save();


    await adduser.create({
      userid: student.studentid,
      password: req.body.password,
      emailid: req.body.emailid,
      role: "Student",
      active: true
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
        mobileno:student.personaldetails.mobileno
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
        mobileno:student.personaldetails.mobileno
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
        }}
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

module.exports={GetStudentDetailsByRoll,
                SearchStudent,StudentCounts,
                StoreStudentDetails,GetStudent,
                giveApprove,giveReject
              
              };