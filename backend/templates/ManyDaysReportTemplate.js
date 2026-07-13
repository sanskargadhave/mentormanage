const manyAttendanceReport = (data)=>{
    return `
    <!DOCTYPE html>
        <html>

        <head>
            <style>
                @page{
                    size:A4 landscape;
                    margin:12mm;
                }
                .header{

                    display:flex;

                    align-items:center;

                    justify-content:center;

                    gap:20px;

                    border-bottom:3px solid #000;

                    padding-bottom:15px;

                }

                .logo{

                    width:90px;

                    height:90px;

                }

                .college-details{

                    text-align:center;

                }

                .college-details h1{

                    font-size:30px;

                    margin:0;

                    letter-spacing:1px;

                }

                .college-details h2{

                    margin-top:10px;

                    font-size:22px;

                }

                .college-details h3{

                    margin-top:5px;

                    color:#555;

                }

                .report-info{

                    display:grid;

                    grid-template-columns:repeat(3,1fr);

                    gap:12px;

                    margin:20px 0;

                }

                .report-info div{

                    border:1px solid #999;

                    padding:10px;

                }

                .report-info span{

                    display:block;

                    font-size:12px;

                    color:#666;

                }

                .report-info strong{

                    font-size:15px;

                }

                .footer{

                    margin-top:25px;

                    border-top:2px solid #000;

                    padding-top:15px;

                }

                .footer-top{

                    display:flex;

                    justify-content:space-between;

                    text-align:center;

                }

                .footer-line{

                    border-top:1px dashed #999;

                    margin:15px 0;

                }

                .copyright{

                    text-align:center;

                    font-size:12px;

                    color:#555;

                }

                .signatures{

                    display:flex;

                    justify-content:space-between;

                    margin-top:60px;

                }

                .signature-box{

                    width:220px;

                    text-align:center;

                }

                .signature-line{

                    border-top:1px solid #000;

                    margin-bottom:8px;

                }
                .attendance-table{

                    width:100%;

                    border-collapse:collapse;

                    table-layout:fixed;

                    margin-top:20px;

                    font-size:11px;

                }

                .attendance-table th{

                    background:#2c3e50;

                    color:white;

                    border:1px solid #444;

                    padding:8px 4px;

                    text-align:center;

                    font-weight:bold;

                }

                .attendance-table td{

                    border:1px solid #888;

                    padding:7px 4px;

                    text-align:center;

                }

                .roll-col{

                    width:65px;

                    font-weight:bold;

                }

                .name-col{

                    width:220px;

                    text-align:left !important;

                    padding-left:10px !important;

                    font-weight:600;

                }

                .date-col{

                    width:32px;

                    font-size:9px;

                    writing-mode:vertical-rl;

                    transform:rotate(180deg);

                    padding:8px 2px;

                }

                .present{

                    color:green;

                    font-weight:bold;

                    background:#eaf8ea;

                }

                .absent{

                    color:red;

                    font-weight:bold;

                    background:#fdeaea;

                }

                .attendance-table tbody tr:nth-child(even){

                    background:#fafafa;

                }

                .attendance-table tbody tr:hover{

                    background:#f4f4f4;

                }
                                            

            </style>
        </head>

        <body>
            <div class="header">
               
                <div class="college-details">
                    <h1>SANGOLA MAHAVIDYALAYA, SANGOLA</h1>
                    <h3>Mentor Management System</h3>
                    <h2>MULTI-DAY ATTENDANCE REPORT</h2>
                </div>
            </div>

            <div class="report-info">

                <div>
                    <span>Department</span>
                    <strong>${data.filters.Department}</strong>
                </div>

                <div>
                    <span>Course</span>
                    <strong>${data.filters.Course}</strong>
                </div>

                <div>
                    <span>Year</span>
                    <strong>${data.filters.Year}</strong>
                </div>

                <div>
                    <span>Division</span>
                    <strong>${data.filters.Division}</strong>
                </div>

                <div>
                    <span>Date Range</span>
                    <strong>${data.filters.FromDate} - ${data.filters.ToDate}</strong>
                </div>

                <div>
                    <span>Generated On</span>
                    <strong>${data.today}</strong>
                </div>

            </div>
            <table class="attendance-table">
                <thead>
                    <tr>
                    <th class="roll-col ">Roll No.</th>
                    <th class="name-col">Student Name</th>
                    ${
                        data.report[0].attendance.map(day=>`
                            <th class="date-col">
                                ${new Date(day.date).toLocaleDateString("en-IN",{
                                    day:"2-digit",
                                    month:"short"
                                })}
                            </th>   
                            `).join("")
                    }
                    </tr>

                </thead>
                <tbody>
                ${
                    data.report.map(student=>`
                        <tr>
                            <td class="roll-col">${student.rollno}</td>
                            <td class="name-col">${student.name}</td>
                            ${
                                student.attendance.map(day=>`
                                    <td class="${day.status==="Present"?"present":"absent"}">
                                        ${day.status==="Present"?"P":"A"}
                                    </td>
                                `).join("")

                            }
                        </tr>       
                    `).join("")
                }
                </tbody>
            </table>
            <div class="footer">

                <div class="footer-top">

                    <div>

                        <strong>Generated by</strong><br>

                        EduMentor @ SangolaCollege Platform

                    </div>

                    <div>

                        <strong>Project</strong><br>

                        Automated Student Test & Attendance Analysis and Reporting Platform

                    </div>

                    <div>

                        <strong>Generated On</strong><br>

                        ${data.today}

                    </div>

                </div>

                <div class="footer-line"></div>

                <div class="copyright">

                    This report is system generated and intended for academic records only.

                </div>

            </div>

            <div class="signatures">

                <div class="signature-box">

                    <div class="signature-line"></div>

                    <p>Class Teacher</p>

                </div>

                <div class="signature-box">

                    <div class="signature-line"></div>

                    <p>Head of Department</p>

                </div>

                <div class="signature-box">

                    <div class="signature-line"></div>

                    <p>Principal</p>

                </div>

            </div>
        </body>
    </html>
    `;
}