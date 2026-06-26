const mongoose=require("mongoose");
const StoreApplication = new mongoose.Schema({
        senderId:{type: mongoose.Schema.Types.ObjectId,required: true},
        receiver_Id:{type: mongoose.Schema.Types.ObjectId,required: true},
        receiverid:{type:String,required:true},
        receiverRole:{type:String,enum:["Student","Mentor","Teacher","Admin"],required:true},
        type:{type:String,required:true},
        message:{type:String,required:true},
        data: mongoose.Schema.Types.Mixed,
        read:{type:Boolean,default:false}
},{timestamps:true})
module.exports=mongoose.model("ApplicationDetails",StoreApplication,"ApplicationDetails");