const {StoreLecture,StoreAttendance}=require("../model/AttendanceSchema");
const ReportdetailsSchema =require("../model/reportSchema");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const supabase =require("../config/supabase");
const {getIO}=require("../socket.js");
const NotificationSchema=require("../model/notificationsScema");
const { StoreMentor } = require("../model/studentSchema.js");
const crypto = require("crypto");
const reportCache = require("../utils/reportCache");

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
        submitedby:submitedby,
        department:lecture.department,
        class:lecture.Class,
        division:lecture.division,
        course:lecture.course

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

const MakeAttendanceReport= async (req,resp)=>{
    try{ 
    const browser = await puppeteer.launch({
      args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: await chromium.executablePath(),
      headless: true
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 0
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();
    const cleanCourse = course.replace(/[^a-zA-Z0-9]/g, "-");
    const cleanDivision = division.replace(/[^a-zA-Z0-9]/g, "-");
    const cleanYear = year.replace(/[^a-zA-Z0-9]/g, "-");
    const simpleDate = new Date().toISOString().split("T")[0];

    const fileName = `Attendance-report-${cleanCourse}-${cleanYear}-${cleanDivision}-${simpleDate}.pdf`;

    const { data, error } = await supabase.storage
      .from("Attendance Report")
      .upload(fileName, pdf, {
        contentType: "application/pdf"
      });

    if (error) throw new Error(error.message);
    

    const pdfurl = `${process.env.SUPABASE_URL}/storage/v1/object/public/Attendance Report/${fileName}`;
    
    const report = await ReportdetailsSchema.create({
      ReportType:"Attendance",
      ReportUrl:pdfurl,
      class:year,
      division:division,
      course:course,
      department:department,
      uplodeDate:today,
      uplodeBy:mentor._id,
      reportid:reportid
    })

        const notification=await NotificationSchema.create({
              senderId:mentor._id,
              senderRole:"Mentor",
              receiver_Id:"697f16cd19432806852e9a24",
              receiverid:"AD-02012006-001",
              receiverRole:"Admin",
              type:"report_submited",
              message:`${mentor.personaldetails.name} has Submited Todays Report.`,
              title:"New Report Submited",
              entityType:"Report",
              entityId:report._id,
              priority:"normal",
              actionUrl:`/admin/report/${report._id}`,
              metadata:{
                id:mentor.mentorId,
                name:mentor.personaldetails.name,
                department:department,
                course:course,
                year:year,
                division:division
              }
            })
            const io=getIO();
            console.log("Sending notification");
            io.to("user_AD-02012006-001").emit("notification",notification);
            
    resp.status(200).json({message:"Report Uplode Succeessfuly",url:pdfurl}); 

    }
    catch(err)
    {
      resp.status(500).json({message:err.message});
      console.log(err.message);
    }
  }


const givepreview=async (req,resp)=>{
  try{
    const {department,year,division,course,fromdate,todate}=req.body;

    const report=await StoreAttendance.aggregate([
      {$match: {
        date: {
          $gte: new Date(fromdate),
          $lte: new Date(todate)
        },
        department:department,
        class:year,
        division:division,
        course:course
      }},

      {$unwind: "$attendance" },
      { $lookup: {
          from: "StudentDetails",
          localField: "attendance.rollno",
          foreignField: "collagedetails.rollno",
          as: "studentdetails"
        }
      },

      {$unwind: "$studentdetails"},
      { $group: {
          _id: {
            student: "$attendance.rollno",
            date: "$date"
          },
          name: { $first: "$studentdetails.personaldetails.name" },
          rollno: { $first: "$attendance.rollno" },
          totalLecture: { $sum: 1},
          presentCount: {
            $sum: {
              $cond: [
                { $eq: ["$attendance.status", "Present"] },
                1,
                0
              ]
            }
          },
          absentCount: {
            $sum: {
              $cond: [
                { $eq: ["$attendance.status", "Absent"] },
                1,
                0
              ]
            }
          }
        }
      },


      {
        $group: {
          _id: "$rollno",
          name: { $first: "$name" },

          overallLecture: { $sum: "$totalLecture" },

          overallPresent: { $sum: "$presentCount"},

          overallAbsent: { $sum: "$absentCount" },

          attendance: {
            $push: {
              date: "$_id.date",
              totalLecture: "$totalLecture",
              present: "$presentCount",
              absent: "$absentCount",
              status: {
                $cond: [
                  { $gt: ["$absentCount", 0] },"Absent","Present"
                ]
              }
            }
          }
        }
      },
      {$set: {
          attendance: {
            $sortArray: {
              input: "$attendance",
              sortBy: {
                date: 1
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          rollno: "$_id",
          name: 1,
          overallLecture: 1,
          overallPresent: 1,
          overallAbsent: 1,
          attendance: 1
        }
      }
    ])
    const cacheId=crypto.randomUUID();
    reportCache.set(cacheId,{
      report,createdAt:Date.now()
    });
    resp.status(200).json({success:true,cacheId,report})
  } 
  catch(err)
  {
    resp.status(500).json({message:err.message});
  }
}

const generateReport=async (req,resp)=>{
  try{
      const cached = reportCache.get(req.body.cacheId);
      if (!cached) {
        return res.status(404).json({success: false, message: "Preview expired. Please generate the preview again."});
      }
      const report = cached.report;

  }
  catch(err)
  {
    console.log(err.message);
    resp.status(500).json({message:err.message});
  }
}


const GetTodayAttendance=async(req,resp)=>{
  try{
    const {department,course,year,division}=req.query;
    const today = new Date();

    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

      const completeLecture=await StoreAttendance.aggregate([ 
      {$match: { 
        date: { 
          $gte: start, 
          $lt:end 
        } 
      }}, 
      {$lookup: {
        from: "LectureDetails", 
        localField: "lectureid",
        foreignField: "lectureid",
        as: "lectureInfo" 
      } },
      { $unwind: "$lectureInfo" },
      {$match:{ 
        $and:[ 
          {"lectureInfo.department":department}, 
          {"lectureInfo.course":course},
          {"lectureInfo.Class":year},
          {"lectureInfo.division":division}, 
        ]
      }}, 
      {$group:{_id:"$lectureInfo.subject"}},
      { $project:{
        subject:"$_id",
        _id:0
      } } 
    ])
    resp.status(200).json({completeLecture});
  }
  catch(err)
  {
    resp.status(500).json({message:err.message});
  }
}

const getreportDetails= async (req,resp)=>{
  try{
    const report = await ReportdetailsSchema.findById(req.params.id).populate("uplodeBy"); ;
    resp.status(200).json(report);
  }
  catch(err)
  {
    return resp.status(500).json({message:err.message});
  }
}

module.exports={StoreAttendances,GetAttendanceByLectureId,MakeAttendanceReport,GetTodayAttendance,getreportDetails,givepreview,generateReport}
