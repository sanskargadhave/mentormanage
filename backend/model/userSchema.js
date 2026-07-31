const mongoose =require("mongoose");
const adduser=new  mongoose.Schema({
    userid:{type:String,required:true},
    password:{type:String,default:null},
    emailid:{type:String},  
    role:{type:String,required:true,enum:["Mentor","Admin","Student","Teacher"]},
    active: {type: Boolean,default: false},
    profileurl:{type:String},
    userId:{type: mongoose.Schema.Types.ObjectId}
});
module.exports=mongoose.model("Users",adduser,"UserDetails");