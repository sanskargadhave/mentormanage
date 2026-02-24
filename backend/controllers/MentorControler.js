const {StoreLecture,StoreAttendance}=require("../model/AttendanceSchema");
const {StoreStudent,StoreMentor,StoreTeacher}= require("../model/studentSchema");
const bcrypt = require("bcryptjs");
//   /api/Mentor/count   URL  GET
const MentorCount= async (req, resp) => {
  try {
    const totalMentor = await StoreMentor.countDocuments(); 
    resp.json({ count: totalMentor });
  } catch (err) {
    resp.status(500).json({ error: err.message });
  }
};


//    /api/add-mentor URL   POST
const AddMentor= async (req,res)=>{
  try{
    const {emailid}=req.body.contactdetails;
    const {mobileno}=req.body.contactdetails;

    const exist=await StoreMentor.findOne({$or:[{"contactdetails.emailid":emailid},{"contactdetails.mobileno":mobileno}]});
    if(exist)
    {
      return res.status(400).json({message:"Email or Mobile No Already Exists...."});
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);
    const mentor=new StoreMentor(req.body);
    await mentor.save();
    res.status(201).json({message:"Mentor Add Sucessfully",mentorId:mentor.mentorId});
  }
  catch(err)
  {
    res.status(500).json({error:err.message});
  }
};

//    /api/mentor-login  URL Get

const MentorLogin = async (req, resp) => {
  try {
    const { emailid, password } = req.body;

    const mentor = await StoreMentor.findOne({ "contactdetails.emailid":emailid}); 
    if (!mentor) {
      return resp.status(404).json({ message: "Mentor Not Found" });
    }

    const match = await bcrypt.compare(password, mentor.password);
    if (!match) {
      return resp.status(401).json({ message: "Password Doesn't Match" });
    }

    resp.status(200).json({ message: "Login Success.... Welcome Mentor" ,mentor});

  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};

const GetMentors= async (req,resp)=>{
  try{
    const Mentors=await StoreMentor.find();
    resp.status(200).json(Mentors);
  }
  catch(err)
  {
    resp.status(500).json({message:err.message});
  }
}

const AssignMentor = async (req, resp) => {
  try {
    const { from, to, mentorid } = req.body;
    const fromNo = Number(from);
    const toNo = Number(to);
    const id = await StoreMentor.findOne(
      { mentorId: mentorid },
      "_id"
    );

    if (!id) {
      return resp.status(404).json({ message: "Mentor not found" });
    }

    const alreadyAssigned = await StoreStudent.findOne({
      "collagedetails.rollno": { $gte: fromNo, $lte: toNo },
      "collagedetails.mentor": { $ne: null }
    });

    if (alreadyAssigned) {
      return resp.status(400).json({
        message: `Roll No ${from} - ${to} Mentor Already Assigned`
      });
    }

    await StoreStudent.updateMany(
      { "collagedetails.rollno": { $gte: fromNo, $lte: toNo } },
      { $set: { "collagedetails.mentor": id._id } }
    );

    resp.status(200).json({ message: "Mentor Assigned Successfully" });

  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
module.exports={MentorCount,AddMentor,MentorLogin,GetMentors,AssignMentor};

