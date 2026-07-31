const mongoose = require("mongoose");

const addattendance = new mongoose.Schema({
  attendanceid:{type:String,unique:true},

  date:{
    type:Date,
    default:Date.now  
  },

  id:{type:mongoose.Schema.Types.ObjectId,ref:"LectureDetails"},
  lectureid:{type:String,required:true},

  attendance:[
  {
    studentId:{type:mongoose.Schema.Types.ObjectId,ref:"student",required:true},
    rollno: {type:Number,required:true},
    status: {type:String,enum: ["Present", "Absent", "Leave", "Late"],required: true},
    application:{type:String}
  }],
  department:{type:String,required:true},
  course:{type:String,required:true},
  class:{type:String,required:true},
  division:{type:String,required:true},
  submitedby:{type:String,required:true},
  semesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    required: true
}
},{timestamps:true});

addattendance.index(  
  { lectureid: 1, date: 1 },
  { unique: true }
);
const addlecture=new mongoose.Schema({
    lectureid:{type:String,unique:true},
    subject:{type:String,required:true},
    teacherid:{type:mongoose.Schema.Types.ObjectId,ref:"teacher",required:true},
    division:{type:String,required:true},
    Class:{type:String,required:true},
    department:{type:String,required:true},
    course:{type:String,required:true},
    semesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    required: true
}
},{timestamps:true});

addlecture.pre("save", function () {
  if (this.lectureid) return;

  const prefix = "LC";
  const subjectName = this.subject;

  const className = this.Class.toUpperCase();
  const divisionCode = this.division.toUpperCase();

  this.lectureid = `${prefix}-${subjectName}-${className}-${divisionCode}`;
});

const StoreLecture=mongoose.model("LectureDetails",addlecture,"LectureDetails");
const StoreAttendance=mongoose.model("AttendanceDetails",addattendance,"AttendanceDetails");

module.exports={StoreLecture,StoreAttendance};