const mongoose =require("mongoose");

const SaarthiMessageModel=new mongoose.Schema({
    role:{type:String,enum:["user","assistant","system"],required:true},
    message:{type:String,required:true},
    responseType:{type:String,default:"text"},
    data:{type:mongoose.Schema.Types.Mixed,default:null},
    createdAt:{type:Date,default:Date.now},
},{_id:false});


const SaarthiConversationModel=new mongoose.Schema({
    mentorId:{type:mongoose.Schema.Types.ObjectId,ref:"MentorDetails",required:true},
    title:{type:String,default:"New Conversation"},
    messages:[SaarthiMessageModel],
    lastMessage:{type:String},
    totalMessages:{type:Number,default:0},
    pinned:{type:Boolean,default:false},
    archived:{type:Boolean,default:false},

},{timestamps:true});
module.exports=mongoose.model("SaarthiChatDetails",SaarthiConversationModel,"SaarthiChatDetails");