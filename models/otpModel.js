import mongoose from "mongoose";




const otpSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    userOtp: { type: String , match: /^[0-9]{6}$/ },
    createdAt: { type: Date, default: Date.now }, // Default to the current time
    expiredAt: { type: Date, default: function() {
        return Date.now() + 3*60*1000; 
    }, expires: "3m" }, // 3 minutes TTL
});

export const otpModel = mongoose.model("otp", otpSchema);




   

