const {StoreStudent,StoreMentor,StoreTeacher}= require("../model/studentSchema");
const {StoreAdmin}=require("../model/adminSchema");

const Counts= async (req, resp) => {
  try {
    const totalStudents = await StoreStudent.countDocuments(); 
    const totalMentor =await StoreMentor.countDocuments();
  
    resp.json({ totalStudents: totalStudents,totalMentor:totalMentor});

  } catch (err) {
    resp.status(500).json({ error: err.message });
  }
};

const getspotlight=async (req,resp)=>{
  try{
   const [admindetails, mentordetails, teacherdetails, studentdetails,totalStudents,totalMentor] =
    await Promise.all([

    StoreAdmin.find(),

    StoreMentor.find(
        { registrationStatus: "Approved" },
        {
            profileurl: 1,
            "personaldetails.name": 1,
            "professionaldetails.department": 1,
            "contactdetails.emailid": 1,
            "contactdetails.mobileno": 1
        }
    ),

    StoreTeacher.find(
        { registrationStatus: "Approved" },
        {
            profileurl: 1,
            "personaldetails.name": 1,
            "professionaldetails.department": 1,
            "contactdetails.emailid": 1,
            "contactdetails.mobileno": 1
        }
    ),

    StoreStudent.find(
        { registrationStatus: "Approved" },
        {
            profileurl: 1,
            "personaldetails.name": 1,
            "collagedetails.department": 1,
            emailid: 1,
            "personaldetails.mobileno": 1
        }
    )
    .sort({ createdAt: -1 })
    .limit(3),
    
    StoreStudent.countDocuments(),
    StoreMentor.countDocuments(),

]);

  const spotlight = [

    ...admindetails.map(admin => ({
        role: "Admin",
        name: admin.personaldetails.name,
        profile: admin.profileurl,
        department: "Administration",
        email: admin.emailid,
        mobile: admin.mobileno
    })),

    ...mentordetails.map(mentor => ({
        role: "Mentor",
        name: mentor.personaldetails.name,
        profile: mentor.profileurl,
        department: mentor.professionaldetails.department,
        email: mentor.contactdetails.emailid,
        mobile: mentor.contactdetails.mobileno
    })),

    ...teacherdetails.map(teacher => ({
        role: "Teacher",
        name: teacher.personaldetails.name,
        profile: teacher.profileurl,
        department: teacher.professionaldetails.department,
        email: teacher.contactdetails.emailid,
        mobile: teacher.contactdetails.mobileno
    })),

    ...studentdetails.map(student => ({
        role: "New Student",
        name: student.personaldetails.name,
        profile: student.profileurl,
        department: student.collagedetails.department,
        email: student.emailid,
        mobile: student.personaldetails.mobileno
    }))

];

    resp.status(200).json({ success: true, spotlight,totalStudents,totalMentor});
  }
  catch(err)
  {
    resp.status(500).json({message:err.message});
  }
}
module.exports={Counts,getspotlight};