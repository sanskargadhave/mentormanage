const mongoose=require("mongoose");
const storeadmissionDetails=mongoose.Schema({
    RecieptNo:{type:String,unique:true,require:true},
    
})