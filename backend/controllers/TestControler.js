const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const supabase =require("../config/supabase");
const {StoreTestResult} = require("../model/testSchema");

const MakeTestReport = async (req, resp) => {
  try {

    const today = new Date().toLocaleDateString();
    const testid = req.params.testid;

    const teacher = await StoreTestResult
      .findOne({ testid: testid }, { students: 0 })
      .populate("teacherid", "personaldetails.name");

    const testdetails = await StoreTestResult
      .findOne({ testid: testid }, { students: 0 });

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

    const testcounts = await StoreTestResult.aggregate([
      { $match: { testid: testid } },
      { $unwind: "$students" },
      {
        $group: {
          _id: "$subject",
          countpass: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$students.marks", "$passingmarks"] },
                    { $eq: ["$students.status", "Present"] }
                  ]
                },
                1,
                0
              ]
            }
          },
          countfail: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ["$students.marks", "$passingmarks"] },
                    { $eq: ["$students.status", "Present"] }
                  ]
                },
                1,
                0
              ]
            }
          },
          countpresent: {
            $sum: {
              $cond: [{ $eq: ["$students.status", "Present"] }, 1, 0]
            }
          },
          countabsent: {
            $sum: {
              $cond: [{ $eq: ["$students.status", "Absent"] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          countpass: 1,
          countfail: 1,
          countpresent: 1,
          countabsent: 1
        }
      }
    ]);

    const counts = testcounts[0] || {
      countpass: 0,
      countfail: 0,
      countpresent: 0,
      countabsent: 0
    };

    const rows = studentsdata.map((data) => `
      <tr>
        <td>${data.rollno}</td>
        <td>${data.name}</td>
        <td>${data.marks}</td>
        <td>${data.status}</td>
        <td>${data.marks >= testdetails.passingmarks ? "Pass" : "Fail"}</td>
      </tr>
    `).join("");

    const html = `
    <html>
      <body>
        <h2 style="text-align:center">Test Report</h2>
        <p><b>Test ID:</b> ${testdetails.testid}</p>
        <p><b>Teacher:</b> ${teacher.teacherid.personaldetails.name}</p>
        <p><b>Date:</b> ${today}</p>

        <table border="1" width="100%" cellspacing="0" cellpadding="5">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Marks</th>
              <th>Status</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <br>
        <p>
          Total: ${counts.countpresent + counts.countabsent}
          Present: ${counts.countpresent}
          Absent: ${counts.countabsent}
          Pass: ${counts.countpass}
          Fail: ${counts.countfail}
        </p>

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

    const fileName = `report_${testid}_${Date.now()}.pdf`;

    const { data, error } = await supabase.storage
      .from("test-reports")
      .upload(fileName, pdf, {
        contentType: "application/pdf"
      });

    if (error) throw new Error(error.message);

    const pdfurl = `${process.env.SUPABASE_URL}/storage/v1/object/public/test-reports/${fileName}`;

    await StoreTestResult.updateOne(
      { testid: testid },
      { $set: { pdfurl: pdfurl } }
    );

    resp.json({
      message: "Report generated and uploaded successfully",
      url: pdfurl
    });

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