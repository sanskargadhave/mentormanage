const {StoreLecture,StoreAttendance}=require("../model/AttendanceSchema");

//   /api/store-attendance URL
const StoreAttendances=async (req,resp)=>{
  try{    
      const {date,lectureid,attendance,submitedby}=req.body;
      const lecture=await StoreLecture.findOne({lectureid:lectureid});
      if(!lecture)
      {
      return resp.status(404).json({ message: "❌Lecture not found" });
      }
      const exists = await StoreAttendance.findOne({ lectureid, date });
      if (exists) 
      {
        return resp.status(400).json({
        message: "❌ Attendance already marked for this lecture & date",exist:true
        });
      }
      const now = new Date();

      const formatted =
      now.getFullYear() +
      (now.getMonth()+1).toString().padStart(2,"0") +
        now.getDate().toString().padStart(2,"0") + "-" +
        now.getHours().toString().padStart(2,"0") +
        now.getMinutes().toString().padStart(2,"0");


      const att= new StoreAttendance({
        attendanceid: `ATT-${formatted}`,
        date:date,
        id:lecture._id,
        lectureid:lectureid,
        attendance:attendance,
        submitedby:submitedby
      });
      await att.save();
      resp.status(201).json({message: "✅ Attendance stored successfully",exist:false});
  }
  catch(err)
  {
    resp.status(500).json({message:err.message})
  }
};


//  /api/get-attendance/:lectureid  URL
const GetAttendanceByLectureId= async (req,resp)=>{
  try
    {
      const now = new Date();
      const startdate=new Date(now.getFullYear(),now.getMonth(),1);
      const enddate=new Date(now.getFullYear(),now.getMonth()+1,1);
      const {lectureid}=req.params;  
      const lecture=await StoreAttendance.findOne({lectureid:lectureid}).populate("id");
      if(!lecture)
      {
      return resp.status(404).json({ message: "❌Lecture not found" });
      }
      
      const result=await StoreAttendance.aggregate([
      {$match:{lectureid:lectureid,date:{$gte:startdate,$lt:enddate}}},
      {$unwind:"$attendance"},
      {$match:{"attendance.status":"Absent"}},
      {$group:{_id:"$attendance.rollno",totalabsent:{$sum:1}}},
      {$match:{totalabsent:{$gte:5}}},
      {$project:{
        _id:0,
        rollno:"$_id",
        totalabsent:1
      }}
      ])

      const counts=await StoreAttendance.aggregate([
        {$match:{date:{
           $gte: new Date(new Date().setHours(0,0,0,0)),
          $lt: new Date(new Date().setHours(24,0,0,0))
        }}},
        {$unwind:"$attendance"},
        {$lookup:{
          from:"LectureDetails",
          localField:"id",
          foreignField:"_id",
          as:"LectureDetails"
        }},
        {$unwind:"$LectureDetails"},
        {$group:{
          _id:{
            department:"$LectureDetails.department",
            Class:"$LectureDetails.Class",
            division:"$LectureDetails.division",
            subject:"$LectureDetails.subject"
          },
          attendanceid: { $first: "$attendanceid" },
          presentcount:{
            $sum:{
              $cond:[
                {$eq:["$attendance.status","Present"]},1,0
              ]
            }
          },
          absentcount:{
            $sum:{
              $cond:[
              {$eq:["$attendance.status","Absent"]},1,0]
            }
          }
        }},
      {$project:{
        department:"$_id.department",
        Class:"$_id.Class",
        division:"$_id.division",
        subject:"$_id.subject",
        presentcount:1,
        absentcount:1,
        attendanceid:1,
      }}
    ])
    resp.status(200).json({result:result,counts:counts});
  }
  catch(err)
  {
    resp.status(500).json({message:err.message});
  }
}


module.exports={StoreAttendances,GetAttendanceByLectureId}
