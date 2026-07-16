const mongoose = require("mongoose");

const PasswordResetSchema = new mongoose.Schema(
  {
    email: { type: String, required: true},
    otp: { type: String, required: true },
    expiresAt: {type: Date,required:true},
    verified: { type: Boolean,default: false}

  },{timestamps: true}
);

// Automatically delete expired OTPs
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

PasswordReset = mongoose.model("PasswordReset", PasswordResetSchema,"PasswordResetDetails");
module.exports = {PasswordReset};