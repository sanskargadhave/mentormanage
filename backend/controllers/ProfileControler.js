const {StoreStudent}= require("../model/studentSchema");
const mongoose = require("mongoose");
const getProfiledetails = async (req,resp)=>{
  try{
    const {id} =  req.params;
    const {role} =req.user;
   
    
    const profileDetails = await StoreStudent.findOne({studentid:id}).select("-password -__v").populate({path:"collagedetails.mentor",select:"personaldetails.name professionaldetails.department professionaldetails.exprience contactdetails.mobileno contactdetails.emailid"});
    if(!profileDetails)
    {
      resp.status(401).json({message:"Student Not Found "});
    }
    resp.status(200).json({profileDetails});
  }
  catch(err)  
  {
    resp.status(500).json({message:err.message})
  }
}

const updateProfiledetails = async (req,resp)=>{
    try{
      const {personalDetails,id}=req.body;

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
        resp.status(200).json({message:"Profile info updated After 7 Days You can Updated "})
    }
    catch(err)
    {
      resp.status(500).json({message:err.message});
    }
}
module.exports={getProfiledetails,updateProfiledetails}