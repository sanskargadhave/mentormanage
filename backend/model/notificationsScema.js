const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({

  senderId:{type: mongoose.Schema.Types.ObjectId,required: true},
  senderRole:{type:String ,enum:["Student","Mentor","Teacher","Admin"],required:true},
  receiverid:{type:String},
  receiver_Id:{type: mongoose.Schema.Types.ObjectId,required: true,index:true},
  receiverRole:{type:String,enum:["Student","Mentor","Teacher","Admin"],required:true},
  type:{type:String,required:true},
  message:{type:String,required:true},
  title:{ type:String,required:true}, 
  entityType:{type:String,required:true},
  entityId:{type: mongoose.Schema.Types.ObjectId,required: true},
  priority: {type:String,enum:["normal","medium","high"],required:true},
  actionUrl:{type:String},
  data: mongoose.Schema.Types.Mixed,
  metadata: mongoose.Schema.Types.Mixed,
  readAt:{type:Date},
  status:{type:String,enum:["sent","delivered","read"],default:"sent"},
  isRead:{type:Boolean,default:false,index:true},
  semesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SemesterDetails",
}
},{timestamps:true});

NotificationSchema.index({receiverId:1});

module.exports = mongoose.model("Notification",NotificationSchema,"NotificationDetails"); 