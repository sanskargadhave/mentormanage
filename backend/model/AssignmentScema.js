const mongoose=require("mongoose");

const AssignmentSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 200},

    description: { type: String,trim: true},

    assignmentType: {type: String,enum: ["Theory", "Practical"],required: true},

    department:{type:String,required:true,index: true},

    course:{type:String,required:true,index: true},

    year:{type:String,required:true,index: true},

    division:{type:String,required:true,index: true},

    subjectId: {type: mongoose.Schema.Types.ObjectId,ref: "LectureDetails",required: true,index: true},

    mentorId: {type: mongoose.Schema.Types.ObjectId,ref: "MentorDetails",required: true,index: true},

    dueDate: {type: Date,required: true},

    maxMarks: {type: Number,required: true,min: 0},

    instructions: {type: String,trim: true},

    allowLateSubmission: {type: Boolean,default: true},

    latePenalty: {type: Number,default: 0},

    status: {type: String,enum: ["Draft", "Published", "Closed"],default: "Published"},

    isDeleted: {type: Boolean,default: false},

    semesterId: { type: mongoose.Schema.Types.ObjectId,ref: "SemesterDetails"}

},{ timestamps: true});

AssignmentSchema.index({
  department:1,
  course:1,
  year:1,
  division:1,
  subjectId: 1,
  dueDate: 1,
});

module.exports = mongoose.model("AssignmentDetails", AssignmentSchema,"AssignmentDetails");