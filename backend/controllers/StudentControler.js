const {StoreStudent}= require("../model/studentSchema");
const {StoreLecture,StoreAttendance}=require("../model/AttendanceSchema");
// /add-student  URL
const StoreStudentDetails=async (req, res) => {
  try {
    const { aadharno } = req.body.personaldetails;
    const { rollno } = req.body.collagedetails;

    const exist = await StoreStudent.findOne({
      $or: [
        { "personaldetails.aadharno": aadharno },
        { "collagedetails.rollno": rollno }
      ]
    });

    if (exist) {
      return res.status(400).json({
        message: "Aadhar No or Roll No already exists"
      });
    }

    const student = new StoreStudent(req.body);
    await student.save();

    res.status(201).json({
      message: "Student added successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to add student",
      error: err.message
    });
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
    const students=await StoreStudent.find({$and:[{"collagedetails.year":datas.Class},{"collagedetails.division":datas.division}]},"personaldetails.name collagedetails.rollno");

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
    resp.status(200).json(students);
  }
  catch(err)
  {
    resp.status(500).json({message:err.message});
  }
};


module.exports={GetStudentDetailsByRoll,SearchStudent,StudentCounts,StoreStudentDetails,GetStudent};