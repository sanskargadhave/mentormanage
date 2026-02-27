const mongoose=require("mongoose");

const StoreTest=new mongoose.Schema({
    students:[{
        studentid:{type:mongoose.Schema.Types.ObjectId,ref:"student",required:true},
        status: {type:String,enum: ["Present", "Absent", "Leave", "Late"],default:"Present"},
        marks:{type:Number,required:true},
    }],
    teacherid:{type:mongoose.Schema.Types.ObjectId,ref:"student",required:true},
    subject:{type:String,required:true},
    testName:{type:String},
    totalmarks:{type:Number,required:true},
    date:{type:Date,required:true}
});

StoreTestResult=mongoose.model("test",StoreTest,"TestDetails");
module.exports={StoreTestResult};
