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
        let user;

        if(role === "Student") {
            user = await StoreStudent.findOne({ studentid: id },"updatedAt");
        }
        else if(role === "Mentor") { 
            user = await StoreMentor.findOne({ mentorId: id },"updatedAt");
        }
        else if(role === "Teacher") {
            user = await StoreTeacher.findOne({ TeacherId: id },"updatedAt");
        }
        else if(role === "Admin") {
            user = await StoreAdmin.findOne({ adminId: id },"updatedAt");
        }
        else {
            return resp.status(403).json({message: "Unauthorised User"});
        }

      
        if(!user){
            return resp.status(404).json({ message: "User not found"});
        }
        
      const updatedAt = new Date(user.updatedAt);
      const today = new Date();

      const differenceInDays = Math.floor((today - updatedAt) / (1000 * 60 * 60 * 24));

      if (differenceInDays < 7) {
       return resp.status(400).json({ message: `You can update after ${7 - differenceInDays} more days`});
      }
      if(role==="Student")
      {
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
      }
        else if(role==="Mentor")
        {
            await StoreMentor.updateOne({mentorId:id},
                {$set:{
                   "personaldetails.name":personalDetails.name,  
                    "personaldetails.address":personalDetails.address,
                    "contactdetails.mobileno":personalDetails.mobileno
                }}
            )
        }
        else if(role==="Teacher")
        {
            await StoreTeacher.updateOne({TeacherId:id},
                {$set:{
                     "personaldetails.name":personalDetails.name,
                    "personaldetails.address":personalDetails.address,
                    "contactdetails.mobileno":personalDetails.mobileno

                }}
            )
        }

        else if(role==="Admin")
        {
            await StoreAdmin.updateOne({adminId:id},
                {$set:{
                   "name":personalDetails.name 
                    
                }}
            )
        }
      
        resp.status(200).json({message:"Profile info updated ...  After 7 Days You can Updated "})
    }
    catch(err)
    {
      resp.status(500).json({message:err.message});
    }
}
module.exports={getProfiledetails,updateProfiledetails}