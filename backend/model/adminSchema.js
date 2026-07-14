const mongoose=require("mongoose");

const adminSchema=new mongoose.Schema({
    emailid:{type:String,required:true},
    
    name:{type:String},
    adminId:{type:String},
    profileurl:{type:String}
});
StoreAdmin= mongoose.model("Admin", adminSchema,"AdminDetails");

module.exports ={StoreAdmin};