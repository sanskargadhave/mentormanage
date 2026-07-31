const mongoose=require("mongoose");

const AssignmentRecordSchema = new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId,ref: "AssignmentDetails",required: true},

    studentId: {type: mongoose.Schema.Types.ObjectId,ref: "StudentDetails",required: true},

    mentorId: {type: mongoose.Schema.Types.ObjectId,ref: "MentorDetails",required: true},

    submissionStatus: {
        type: String,
        enum: ["Pending","Submitted","Late Submitted","Not Submitted"],default: "Pending"
    },

    evaluationStatus: {
        type: String,
        enum: ["Not Checked","Checked"],default: "Not Checked"
    },

    submittedDate: {type: Date,default: null},

    checkedDate: {type: Date,default: null},

    obtainedMarks: {type: Number,min: 0,default: null},

    feedback: {type: String,trim: true,default: ""},

    remarks: {type: String,trim: true,default: ""},

    isAbsent: {type: Boolean,default: false},

    isDeleted: {type: Boolean,default: false},
    
    semesterId: { type: mongoose.Schema.Types.ObjectId,ref: "SemesterDetails"}
    

}, {timestamps: true});

AssignmentRecordSchema.index(
    {assignmentId: 1,studentId: 1},
    {unique: true}
);

AssignmentRecordSchema.index({assignmentId: 1});

AssignmentRecordSchema.index({studentId: 1});

AssignmentRecordSchema.index({
    assignmentId: 1,
    submissionStatus: 1,
    evaluationStatus: 1
});
module.exports = mongoose.model("AssignmentRecordDetails",AssignmentRecordSchema,"AssignmentRecordDetails");