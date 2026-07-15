const UserActivitySchema = new mongoose.Schema({
        userId: {   type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },

        activityType: { type: String, enum: [ "LOGIN", "LOGOUT", "PASSWORD_CHANGED", "PROFILE_UPDATED"], default: "LOGIN"},

        ipAddress: {type:String},

        browser: {type:String},

        operatingSystem: {type:String},

        deviceType: {type:String},

        userAgent: {type:String},

        location: {type:String},

        status: { type: String,enum: ["SUCCESS", "FAILED"],
            default: "SUCCESS"
        }

    }   
    ,{ timestamps: true}
);
UserActivity=mongoose.model("ActivityLogs",UserActivitySchema,"UserActivityDetails");
module.exports={UserActivity};