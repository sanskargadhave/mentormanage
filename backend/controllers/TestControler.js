const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const cloudinary=require("../config/cloudinary");
const {StoreTestResult} = require("../model/testSchema");

const MakeTestReport = async (req, resp) => {
  try {
    const today = new Date().toLocaleDateString();
    const testid = req.params.testid;
    
    const teacher=await StoreTestResult.findOne({testid:testid},{students:0}).populate("teacherid","personaldetails.name");
    
    const testdetails = await StoreTestResult.findOne({ testid: testid },{ students: 0 });

    const studentsdata = await StoreTestResult.aggregate([
      { $match: { testid: testid } },
      { $unwind: "$students" },
      {
        $lookup: {
          from: "StudentDetails",
          localField: "students.studentid",
          foreignField: "_id",
          as: "studentinfo"
        }
      },
      { $unwind: "$studentinfo" },
      {
        $project: {
          _id: 0,
          name: "$studentinfo.personaldetails.name",
          rollno: "$studentinfo.collagedetails.rollno",
          marks: "$students.marks",
          status: "$students.status"
        }
      },
      { $sort: { rollno: 1 } }   
    ]);
    const testcounts=await StoreTestResult.aggregate([
            {$match:
  	            {
                    testid:testid
  	        }},
            {$unwind:"$students"},
            {$group:{
                _id:"$subject",
                countpass:{
                    $sum:{
                        $cond:[{
                            $and:[
                              	{$gte:["$students.marks","$passingmarks"]},
                              	{$eq:["$students.status","Present"]}
                          		]
                        },1,0]
                    }
                },
                countfail:{
                    $sum:{
                        $cond:[{
                        	$and:[
                            {$lt:["$students.marks","$passingmarks"]},
                            {$eq:["$students.status","Present"]}
                        ]},1,0]
                    }
                },
              countpresent:{
                $sum:{
                  $cond:[{
                    $eq:["$students.status","Present"]
                  },1,0]
                }
              },
               countabsent:{
                $sum:{
                  $cond:[{
                    $eq:["$students.status","Absent"]
                  },1,0]
                }
              }
            }},
            {$project:{
                _id:0,
                countpass:1,
                countfail:1,
              	countpresent:1,
              	countabsent:1
            }}
        ]);
    
    const rows = studentsdata.map((data) => `
      <tr>
        <td>${data.rollno}</td>
        <td>${data.name}</td>
        <td>${data.marks}</td>
        <td>${data.status}</td>
        <td>${data.marks>=testdetails.passingmarks ? "Pass" : "Fail"}</td>
      </tr>
    `).join("");

    const html = `
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
                        <h3>Department of ${testdetails.department}</h3>
                        <h3>Test Report</h3>
                        <h2>${testdetails.testName}</h2>
                    </div>
                </div>
                <hr>
                <p><b>Test ID:</b> ${testdetails.testid}</p>

                <p><b>Course:</b> ${testdetails.course}     <b>Year:</b> ${testdetails.year}     <b>Division:</b> ${testdetails.division}</p>
                
                <p><b>Total Marks:</b> ${testdetails.totalmarks}</p>
                <p><b>Passing Criteria:</b>  ${testdetails.passingmarks}</p>
                <p><b>Date:</b>  ${testdetails.date.toLocaleDateString()}  </p>
                <p><b>Subject:</b>  ${testdetails.subject}  </p>
                <p><b>Teacher Name:</b> Prof. ${teacher.teacherid.personaldetails.name}  </p>
                <p><b>Counts:</b>    <b class="bolds">  Total :</b> ${testcounts[0].countpresent+testcounts[0].countabsent}     <b class="bolds">Present:</b> ${testcounts[0].countpresent}    <b class="bolds">Absent:</b> ${testcounts[0].countabsent}    <b class="bolds">Pass:</b>${testcounts[0].countpass}    <b class="bolds">Fail:</b>${testcounts[0].countfail}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Marks</th>
                            <th>P/A</th>
                            <th>Pass/Fail</th>
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

   
    
    const uploadResult = await new Promise((resolve, reject) => {

      const stream = cloudinary.uploader.upload_stream(
        {
            resource_type: "raw",
            type: "upload",
            access_mode: "public",
            folder: "test_reports",
            public_id: `report_${testid}_${Date.now()}`,
            format: "pdf"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(pdf);
    });
    
    const AlreadyUploded=await StoreTestResult.findOne({pdfurl:uploadResult.secure_url});
    if(AlreadyUploded)
    {
        resp.json({message: "Report Already Uplode Test May Be Already Exist"});
    }
    else
    {
        const update=await StoreTestResult.updateOne({testid:testid},{$set: { pdfurl: uploadResult.secure_url } }); 
        resp.json({message: "Report generated and Uplode successfully",url:uploadResult.secure_url});
    }
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};

const StoreTest=async (req,resp)=>{
    try{
        
        const isalreadyexist=await StoreTestResult.findOne({testid:req.body.testid});
        if(isalreadyexist)
        {
            return resp.status(404).json({message:"This Test Already Exist",testid:req.body.testid});
        }
        
        const data=new StoreTestResult(req.body);
        await data.save();
        
        resp.status(200).json({message:"Test Result Successfuly Stored",testid:req.body.testid});
    }
    catch(err)
    {
        resp.status(500).json({message:err.message});
    }
}
const GetTestSummery=async (req,resp)=>{
    try{
        const testcounts=await StoreTestResult.aggregate([
            {$match:
  	            {
                    testid:req.params.testid
  	        }},
            {$unwind:"$students"},
            {$group:{
                _id:"$subject",
                countpass:{
                    $sum:{
                        $cond:[{
                            $and:[
                              	{$gte:["$students.marks","$passingmarks"]},
                              	{$eq:["$students.status","Present"]}
                          		]
                        },1,0]
                    }
                },
                countfail:{
                    $sum:{
                        $cond:[{
                        	$and:[
                            {$lt:["$students.marks","$passingmarks"]},
                            {$eq:["$students.status","Present"]}
                        ]},1,0]
                    }
                },
              countpresent:{
                $sum:{
                  $cond:[{
                    $eq:["$students.status","Present"]
                  },1,0]
                }
              },
               countabsent:{
                $sum:{
                  $cond:[{
                    $eq:["$students.status","Absent"]
                  },1,0]
                }
              }
            }},
            {$project:{
                _id:0,
                countpass:1,
                countfail:1,
              	countpresent:1,
              	countabsent:1
            }}
        ])

        const topstudents=await StoreTestResult.aggregate([
            {$match:{
                    testid:req.params.testid
  	            }
            },
            {$unwind:"$students"},
            {$match:{
                "students.status":"Present"
  	            }
            },
            {$sort:{
                "students.marks":-1
                }
            },
            {$limit:3},
            {$lookup:{
                from:"StudentDetails",
                localField:"students.studentid",
                foreignField:"_id",
                as:"studentinfo"
                }
            },
            {$unwind:"$studentinfo"},
            {$project:{
                _id:0,
                name:"$studentinfo.personaldetails.name",
                rollno:"$studentinfo.collagedetails.rollno",
                marks:"$students.marks"
                }
            }
        ])
        
        resp.status(200).json({testcounts:testcounts,topstudents:topstudents})
    }
    catch(err)
    {
        resp.status(500).json({message:err.message});
    }
}


module.exports={StoreTest,GetTestSummery,MakeTestReport};