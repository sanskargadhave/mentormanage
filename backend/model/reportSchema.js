const mongoose =require("mongoose");
const ReportdetailsSchema=new mongoose.Schema({
    ReportType:{type:String,required:true},
    ReportUrl:{type:String,required:true},
    course:{type:String,required:true},
    division:{type:String,required:true},
    class:{type:String,required:true},
    department:{type:String,required:true},
    uplodeDate:{type:Date,required:true},

})
module.exports=mongoose.model("ReportDetail",ReportdetailsSchema,"ReportDetails")