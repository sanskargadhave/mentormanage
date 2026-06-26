const {StoreStudent,StoreMentor,StoreTeacher}= require("../model/studentSchema");
const {StoreAdmin}=require("../model/adminSchema");
const mongoose = require("mongoose");
const getProfiledetails = async (req, resp) => {
    try {
        const { id } = req.params;
        const { role } = req.user;

        let profileDetails;

        if (role === "Student") {
            profileDetails = await StoreStudent.findOne({ studentid: id })
                .select("-password -__v")
                .populate({
                    path: "collagedetails.mentor",
                    select: "personaldetails.name professionaldetails.department professionaldetails.exprience contactdetails.mobileno contactdetails.emailid"
                });
        }
        else if (role === "Mentor") {
            const mentor = await StoreMentor.findOne({ mentorId: id })
                .select("-password -__v");
          
            const studentdetails = await StoreStudent.find({"collagedetails.mentorId":id}).select("-password -__v");

            profileDetails = {
                personaldetails:{
                    name:mentor.personaldetails.name,
                    dob:mentor.personaldetails.dob,
                    mobileno:mentor.contactdetails.mobileno,
                    
                    address:mentor.contactdetails.address,
                },
                collagedetails:{
                    department:mentor.professionaldetails.department,
                    qualification:mentor.professionaldetails.qualification,
                    exprience:mentor.professionaldetails.exprience,
                    joiningdate:mentor.professionaldetails.joiningdate,
                },
                emailid:mentor.contactdetails.emailid,
                studentdetails:studentdetails,
                
            }
        }
        else if (role === "Teacher") {
            const teacher = await StoreTeacher.findOne({ TeacherId: id })
                .select("-password -__v");
            profileDetails = {
                personaldetails:{
                    name:teacher.personaldetails.name,
                    dob:teacher.personaldetails.dob,
                    mobileno:teacher.contactdetails.mobileno,
                    emailid:teacher.contactdetails.emailid,
                    address:teacher.contactdetails.address,
                },
                collagedetails:{
                    department:teacher.professionaldetails.department,
                    qualification:teacher.professionaldetails.qualification,
                    exprience:teacher.professionaldetails.exprience,
                    joiningdate:teacher.professionaldetails.joiningdate,
                },
                emailid:teacher.contactdetails.emailid,
            }
        }
        else if (role === "Admin") {
            profileDetails = await StoreAdmin.findOne({ adminId: id })
                .select("-password -__v");
        }

        if (!profileDetails) {
            return resp.status(404).json({
                message: `${role} Not Found`
            });
        }

        return resp.status(200).json({ profileDetails });

    } catch (err) {
        return resp.status(500).json({
            message: err.message
        });
    }
};
const updateProfiledetails = async (req,resp)=>{
    try{
      const {personalDetails,id,role}=req.body;

      const student = await StoreStudent.findOne({ studentid: id },"updatedAt" );

      if (!student) {
        return resp.status(404).json({ message: "Student Not Found"});
      }

      const updatedAt = new Date(student.updatedAt);
      const today = new Date();

      const differenceInDays = Math.floor((today - updatedAt) / (1000 * 60 * 60 * 24));

      if (differenceInDays < 7) {
       return resp.status(400).json({ message: `You can update after ${7 - differenceInDays} more days`});
      }
      
      await StoreStudent.updateOne({studentid:id},
        {$set:{
          "personaldetails.name":personalDetails.name,
          "personaldetails.address":personalDetails.address,
          "personaldetails.aadharno":personalDetails.aadharno,
          "personaldetails.dob":personalDetails.dob,
          "personaldetails.fathername":personalDetails.fathername,
          "personaldetails.mothername":personalDetails.mothername,
          "personaldetails.mobileno":personalDetails.mobileno,
          "personaldetails.parentno":personalDetails.parentno,
          "personaldetails.pincode":personalDetails.pincode
        }})
        resp.status(200).json({message:"Profile info updated ...  After 7 Days You can Updated "})
    }
    catch(err)
    {
      resp.status(500).json({message:err.message});
    }
}
module.exports={getProfiledetails,updateProfiledetails}