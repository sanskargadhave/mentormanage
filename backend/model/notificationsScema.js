const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({

  senderId: {type: mongoose.Schema.Types.ObjectId,required: true},

  receiverId: {type: mongoose.Schema.Types.ObjectId,required: true},

  receiverRole: {type: String,enum: ["student", "mentor", "teacher", "admin"],required: true},

  type: {type: String,required: true},

  message: {type: String,required: true},

  data: {type: Object},

  read: {type: Boolean,default: false}

}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema,"NotificationDetails"  );