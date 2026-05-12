const {StoreStudent,StoreMentor}= require("../model/studentSchema");
const Counts= async (req, resp) => {
  try {
    const totalStudents = await StoreStudent.countDocuments(); 
    const totalMentor =await StoreMentor.countDocuments();
  
    resp.json({ totalStudents: totalStudents,totalMentor:totalMentor});

  } catch (err) {
    resp.status(500).json({ error: err.message });
  }
};
module.exports={Counts};