const mongoose=require("mongoose");

const StoreStudentScema=new mongoose.Schema({
    personaldetails:{
        name:{type:String,required:true},
        address:{type:String,required:true},
        pincode:{type:Number,required:true},
        dob:{type:Date,required:true},
        gender:{type:String,required:true},
        aadharno:{type:Number,required:true,unique:true},
        fathername:{type:String,required:true},
        mothername:{type:String,required:true},
        mobileno:{type:Number,required:true},
        parentno:{type:Number,required:true},
        sscpercentage:{type:Number,required:true,min:0,max:100},
        hscpercentage:{type:Number,required:true,min:0,max:100}
    },
    collagedetails:{
        department:{type:String,required:true},
        course:{type:String,required:true},
        year:{type:String,required:true},
        division:{type:String,required:true},
        rollno:{type:Number,required:true,unique:true},
        idno:{type:String,required:true},
        mentor:{type:mongoose.Schema.Types.ObjectId,ref:"mentor",default:null}
    }
    },
    {timestamps:true}
);

const addMentor=new mongoose.Schema({
    mentorId:{type:String,unique:true},
    personaldetails:{
        name:{type:String,required:true},
        gender:{type:String,required:true},
        dob:{type:Date,required:true},
    },
    professionaldetails:{
        department:{type:String,required:true},
        qualification:{type:String,required:true},
        exprience:{type:String,required:true},
        joiningdate:{type:Date},
    },
    contactdetails:{
        mobileno:{type:Number,required:true},
        emailid:{type:String,required:true,unique:true},
        address:{type:String,required:true}
    },
    password:{type:String,required:true}
});

const addTeacher=new mongoose.Schema({
    TeacherId:{type:String,unique:true},
    personaldetails:{
        name:{type:String,required:true},
        gender:{type:String,required:true},
        dob:{type:Date,required:true},
    },
    professionaldetails:{
        department:{type:String,required:true},
        qualification:{type:String,required:true},
        exprience:{type:String,required:true},
        joiningdate:{type:Date},
    },
    contactdetails:{
        mobileno:{type:Number,required:true,unique:true},
        emailid:{type:String,required:true,unique:true},
        address:{type:String,required:true}
    },
    password:{type:String,required:true}
});

addMentor.pre("save", async function () {
  if (!this.isNew) return;

  if (!this.mentorId && this.personaldetails?.dob) {
    const dob = new Date(this.personaldetails.dob);

    const dd = String(dob.getDate()).padStart(2, "0");
    const mm = String(dob.getMonth() + 1).padStart(2, "0");
    const yyyy = dob.getFullYear();

    const dobPart = `${dd}${mm}${yyyy}`;

    const count = await this.constructor.countDocuments({
      "personaldetails.dob": this.personaldetails.dob
    });

    this.mentorId = `MN-${dobPart}-${String(count + 1).padStart(3, "0")}`;
  }
});

addTeacher.pre("save", async function () {
  if (!this.isNew) return;

  if (!this.TeacherId && this.personaldetails?.dob) {
    const dob = new Date(this.personaldetails.dob);

    const dd = String(dob.getDate()).padStart(2, "0");
    const mm = String(dob.getMonth() + 1).padStart(2, "0");
    const yyyy = dob.getFullYear();

    const dobPart = `${dd}${mm}${yyyy}`;

    const count = await this.constructor.countDocuments({
      "personaldetails.dob": this.personaldetails.dob
    });

    this.TeacherId = `TC-${dobPart}-${String(count + 1).padStart(3, "0")}`;
  }
});

StoreStudent=mongoose.model("student",StoreStudentScema,"StudentDetails");
StoreMentor=mongoose.model("mentor",addMentor,"MentorDetails");
StoreTeacher=mongoose.model("teacher",addTeacher,"TeacherDetails");
module.exports={StoreStudent,StoreMentor,StoreTeacher};