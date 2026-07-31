const {StoreLecture}=require("../model/AttendanceSchema");
const {StoreTeacher}= require("../model/studentSchema");
const  {getCurrentSemester}=require("../utils/semesterValidation.js")

//   /api/store-lecture  URl POST
const StoreLectures = async (req,resp)=>{
  try{
    const {teacherid}=req.body;
    const currentSemester=await getCurrentSemester();

    if (!currentSemester) { 
      return resp.status(400).json({ success: false, message: "No active semester found."});
    }

    const teacher=await StoreTeacher.findOne({TeacherId:teacherid});
    req.body.teacherid=teacher._id;
    req.body.semesterId=currentSemester._id;
    const lecture=new StoreLecture(req.body);

    await lecture.save();
    resp.status(200).json({success: true,message:`✅Lecture Sucessfully Add LectureId : ${lecture.lectureid}`});
  }
  catch(err)
  {
    if(err.code===11000)
    {
      resp.status(500).json({success: false,message:"✖️ Lecture Already Exists Please Add Another"});
    }
    resp.status(500).json({success: false,message:err.message});
  }
};


//  /api/getlecture  GET

const GetLectures=async (req,resp)=>{
  try{
    const lecture=await StoreLecture.find();
    resp.status(200).json(lecture);
  }
  catch(err)
  {
    resp.status(500).json({success: false,message:err.message});
  }
};

module.exports={GetLectures,StoreLectures}