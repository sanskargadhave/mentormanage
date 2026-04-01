const mongoose=require("mongoose");
const storeadmission=mongoose.Schema({
    ReceiptNo:{type:Number,unique:true,required:true},
    name:{type:String,required:true}
})
const storeadmissionDetails = mongoose.model(
    "admission",
    storeadmission,
    "AdmissionDetails"
);
module.exports={storeadmissionDetails};