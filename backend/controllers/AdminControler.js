const readadmin = require("../model/adminSchema");
const {StoreStudent, StoreMentor, StoreTeacher}= require("../model/studentSchema");
const semesterSchema=require("../model/SemesterScema");
const StoreApplication=require("../model/applicationScema");
const {StoreLecture,StoreAttendance}=require("../model/AttendanceSchema");
const NotificationSchema=require("../model/notificationsScema");
const ReportdetailsSchema=require("../model/reportSchema");
const {StoreTestResult}=require("../model/testSchema");

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
const DashboardAnalysis =async (req,resp)=>{
  try{
     const semester = await semesterSchema.findOne({
        isCurrent: true
    }).lean();

    
    if (!semester) return resp.status(404).json({ message: "No active semester found."});
    const semesterFilter = {
      $gte: semester.startDate,
      $lte: semester.endDate
    };

    const [activeStudents,activeMentors,activeTeachers,inactiveTeachers,inactiveMentors,
            inactiveStudents,totalLectures,totalTests,leaveRequests
          ]=await Promise.all([
              StoreStudent.countDocuments({isactive:true,registrationStatus:"Approved"}),
              StoreMentor.countDocuments({isactive:true,registrationStatus:"Approved"}),
              StoreTeacher.countDocuments({isactive:true,registrationStatus:"Approved"}),
              StoreTeacher.countDocuments({isactive:false}),
              StoreMentor.countDocuments({isactive:false}),
              StoreStudent.countDocuments({isactive:false}),
              StoreAttendance.countDocuments({date: semesterFilter}),
              StoreTestResult.countDocuments({date: semesterFilter}),
              StoreApplication.countDocuments({createdAt: semesterFilter, type:"leave_request" }),
          ]);

          const data={ 
            users:{
              activeStudents,
              activeMentors,
              activeTeachers,
              inactiveStudents,
              inactiveMentors,
              inactiveTeachers
            },
            academic:{
              totalLectures,
              totalTests,
              leaveRequests
            },
            semester: {
              name: semester.name,
              academicYear: semester.academicYear,
              startDate: semester.startDate,
              endDate: semester.endDate
            },
          }

          resp.status(200).json(data)
  }
  catch(err)
  {
    resp.status(500).json({message:err.message});
  }
}
const fetchdata = async (req,resp)=>{
  try{
    const {page,limit,search,department,course,year,division,role}=req.params;
    const currentPage = parseInt(page) || 1;
    const pageLimit = parseInt(limit) || 10;
    
    const filter={};
    if(search) filter["personaldetails.name"]={$regex:search,$options:"i"};
    if(department) filter["collagedetails.department"]=department;
    if(course) filter["collagedetails.course"]=course;
    if(year) filter["collagedetails.year"]=year;
    if(division) filter["collagedetails.division"]=division;

    const skip = (currentPage - 1) * pageLimit;
    const totalRecords = await StoreStudent.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / pageLimit);

    const students = await StoreStudent.find(filter).sort({ "collagedetails.rollno": 1 }).skip(skip).limit(pageLimit);


    const data = {
      students,
      pagination: {
        currentPage: currentPage,
        totalPages,
        totalRecords,
        limit,
        hasNext: currentPage < totalPages,
        hasPrevious: currentPage > 1
    }
    }
    resp.status(200).json(data);
  }
  catch(err)
  {
    resp.status(500).json({message:err.message});
  }
}
module.exports={AdminLogin,UserCounts,DashboardAnalysis,fetchdata};