const mongoose=require("mongoose");

const StoreTest=new mongoose.Schema({
    students:[{
        studentid:{type:mongoose.Schema.Types.ObjectId,ref:"student",required:true},
        marks:{type:Number,required:true},
        status:{type:String,enum:["Present","Absent","leave"],default:"Absent"}
    }],
    testid:{type:String},
    teacherid:{type:mongoose.Schema.Types.ObjectId,ref:"teacher",required:true},
    subject:{type:String,required:true},
    testName:{type:String},
    totalmarks:{type:Number,required:true},
    date:{type:Date,required:true},
    passingmarks:{type:Number,required:true},
    course:{type:String,required:true},
    department:{type:String,required:true},
    year:{type:String,required:true},
    division:{type:String,required:true},
});

StoreTestResult=mongoose.model("test",StoreTest,"TestDetails");
module.exports={StoreTestResult};
