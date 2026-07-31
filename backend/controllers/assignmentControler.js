const AssignmentSchema =require("../model/AssignmentScema");
const AssignmentRecordSchema=require("../model/AssignmentRecordScema");
const {StoreStudent}=require("../model/studentSchema");
const {getCurrentSemester}=require("../utils/semesterValidation");

const addAssignment= async (req,resp)=>{
    try{
        const currentSemester=await getCurrentSemester();
        if (!currentSemester) { 
            return resp.status(400).json({ success: false, message: "No active semester found."});
        }
        const assignment=await AssignmentSchema.create({
            title:req.body.AssignmentTitle ,
            description: req.body.AssignmentDescription,
            assignmentType:req.body.AssignmentType,
            department:req.body.Department,
            course:req.body.Course,
            year:req.body.Year,
            division:req.body.Division,
            subjectId:req.body.SubjectId,
            mentorId:req.body.mentorId,
            dueDate:req.body.DueDate,
            maxMarks:req.body.MaxMarks,
            instructions:req.body.Instructions,
            allowLateSubmission:req.body.AllowLateSubmission,
            status:req.body.Status,
            semesterId:currentSemester._id,
        });
        if(assignment.status==="Published"){

        
            const students=await StoreStudent.find({
            "collagedetails.department":assignment.department,
                "collagedetails.course":assignment.course,
                "collagedetails.year":assignment.year,
                "collagedetails.division":assignment.division,
                isactive:true
            }).select("_id");
            console.log(students);

            const records=students.map(student=>({
                assignmentId:assignment._id,
                studentId:student._id,
                mentorId:req.body.mentorId,
                semesterId:currentSemester._id,
            }))
            console.log(records);
            await AssignmentRecordSchema.insertMany(records);
        }
        resp.status(200).json({message:"Assignment Successfuly Stored",success:true});
    }
    catch(err)
    {
        console.log(err.message);
        resp.status(500).json({message:err.message,success:false});
    }
};


const getAssignments = async (req, resp) => {

    try {
        const {mentorId,division,year,subjectId,type,search} = req.query;
        const filter = {mentorId};

        if (search) filter.title = {$regex: search,$options: "i"};
        if (type) filter.assignmentType = type;
        if (division) filter.division = division;
        if (year)  filter.year = year;
        if (subjectId) filter.subjectId = subjectId;

        const assignments = await AssignmentSchema.find(filter)
            .populate("subjectId", "subject")
            .sort({ createdAt: -1 });

        return resp.status(200).json({success: true,assignments});
    }
    catch (err) {
        return resp.status(500).json({success: false,message: err.message});
    }
};
module.exports={addAssignment,getAssignments};