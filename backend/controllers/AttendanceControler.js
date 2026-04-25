const {StoreLecture,StoreAttendance}=require("../model/AttendanceSchema");
const ReportdetailsSchema =require("../model/reportSchema");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const supabase =require("../config/supabase");
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

const MakeAttendanceReport= async (req,resp)=>{
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



      const attendanceCounts=await StoreAttendance.aggregate([
        {
          $match: {
            date: {
              $gte: start,
              $lt: end
            }
          }
      },
        {$lookup: {
            from: "LectureDetails",  
            localField: "lectureid",
            foreignField: "lectureid",
            as: "lectureInfo"
          }
        },
        { $unwind: "$lectureInfo" },
        { $unwind: "$attendance" },
				{$match:{
        	$and:[
						{"lectureInfo.department":department},
						{"lectureInfo.course":course},
						{"lectureInfo.Class":year},
						{"lectureInfo.division":division},
					]
				}},
   			{
          $group: {
            _id: "$attendance.rollno",

            totalLectures: { $sum: 1 },

            presentCount: {
              $sum: {
                $cond: [{ $eq: ["$attendance.status", "Present"] }, 1, 0]
              }
            },

            absentCount: {
              $sum: {
                $cond: [{ $eq: ["$attendance.status", "Absent"] }, 1, 0]
              }
            },

            absentSubjects: {
              $push: {
                $cond: [
                  { $eq: ["$attendance.status", "Absent"] },
                    "$lectureInfo.subject",
                  null   
                ]
              } 
            }
          }
        },
        {$sort:{_id:1}},
        {
          $project: {
            rollno: "$_id",
            _id: 0,
            totalLectures: 1,
            presentCount: 1,
            absentCount: 1,

            absentSubjects: {
              $filter: {
                input: "$absentSubjects",
                as: "sub",
                cond: { $ne: ["$$sub", null] }
              }
            }
          }
        }
      ])
      
     

      const rows = attendanceCounts.map((data) => `
      <tr>
        <td>${data.rollno}</td>
        <td>${data.totalLectures}</td>
        <td>${data.presentCount}</td>
        <td>${data.absentCount}</td>
        <td>${data.absentSubjects.length === 0 ? "--" : data.absentSubjects.join(", ")}</td>
      </tr>
      `);

      const html=`
      <html>
        <head>
          <style>

            body{
              font-family: Arial;
              padding: 30px;
            }

            h2{
              text-align:center;
            }

            h3{ 
              text-align:center;
            } 

            table{
              width:100%;
              border-collapse: collapse;
              margin-top:20px;
            }

            th,td{
              border:1px solid black;
              padding:6px;
              text-align:center ;
            }

            th{
              background:#f2f2f2;
            }

            .header{
              display:flex;
              align-items:center;
              justify-content:center;
              gap:20px;
            }

            .logo{
              width:70px;
            }

            .title{
              text-align:center;
            }

            .footer{
              margin-top:40px;
              border-top:2px solid #444;
              padding-top:10px;
              text-align:center;
              font-size:12px;
              color:#555;
            }

            .system-info{
              font-weight:bold;
              margin-bottom:4px;
            }

            .project-desc{
              font-style:italic;
              margin-bottom:4px;
            }

            .date{
              font-size:11px;
              color:#777;
            }

            .signatures{
              display:flex;
              justify-content:space-between;
              margin-top:40px;
              text-align:center;
            }

            .signatures div{
              width:200px;
              border-top:1px solid black;
              padding-top:5px;
            }

            .bolds{
              margin-left:10px;
            }

          </style>
        </head>

        <body>

          <div class="header">

            <div class="title">
              <h2>Sangola Mahavidyalaya Sangola</h2>
              <h3>Department of ${department}</h3>
              <h3>Daily Attendance Report </h3>
              
            </div>

          </div>

          <hr>

          

          <p>
            <b>Course:</b> ${course}
            <b>Year:</b> ${year}
            <b>Division:</b> ${division}
          </p>


          <p><b>Date:</b>${today}</p>


          <table>

            <thead>
              <tr>
                <th>Roll No</th>
                <th>Total Lectures</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Absent Lecture</th>
              </tr>
            </thead>

            <tbody>
              ${rows}
            </tbody>

          </table>

          <br><br>

          <div class="footer">

            <div class="system-info">
              Generated by <b>EduMentor @SangolaCollege Platform</b>
            </div>

            <div class="project-desc">
              🎓 EduMentor Platform – Automated Student Test And Attendance Analysis and Reporting Platform
            </div>

            <div class="date">
              📅 Generated on: ${today}
            </div>

          </div>

          <div class="signatures">

            <div>Class Teacher</div>
            <div>Head of Department</div>
            <div>Principal</div>

          </div>

        </body>
      </html>
    `;
      
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
      .from("test-reports")
      .upload(fileName, pdf, {
        contentType: "application/pdf"
      });

    if (error) throw new Error(error.message);
    

    const pdfurl = `${process.env.SUPABASE_URL}/storage/v1/object/public/test-reports/${fileName}`;
    
    await ReportdetailsSchema.create({
      ReportType:"Attendance",
      ReportUrl:pdfurl,
      class:year,
      division:division,
      course:course,
      department:department,
      uplodeDate:today,
    })

    resp.status(200).json({message:"Report Uplode Succeessful"});

    }
    catch(err)
    {
      resp.status(500).json({message:err.message});
      console.log(err.message);
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
module.exports={StoreAttendances,GetAttendanceByLectureId,MakeAttendanceReport,GetTodayAttendance}
