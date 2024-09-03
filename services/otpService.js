import { otpModel } from "../models/otpModel.js";
import { generateOtp, sendEmail } from "../utils/helperFunctions.js";
import { userService } from "./userService.js";

const otpService = {};



otpService.saveOtpForUser = async(otpObject) => {
    const userOtpObj = new otpModel(otpObject);
    await userOtpObj.save();
};


otpService.getUserOtp = async(userId) => {
    return await otpModel.findOne({ userId });
};

otpService.clearUserOtpObject = async(id) => {
    await otpModel.findOneAndDelete({ _id: id });
};

otpService.sendOtp = async(userId, email) => {
    const otp = generateOtp(); // Generate a 6-digit OTP in string format
    await otpService.saveOtpForUser({ userId, userOtp: otp });

    if (email) {
        await sendEmail({
            to: email,
            subject: "Your OTP",
            message: `<p>Your OTP is: <strong>${otp}</strong></p>`,
        });
    }
    return { success: true };
};

otpService.verifyOtp = async(userId, enteredOtp) => {
    const otpInDb = await otpService.getUserOtp(userId);
    if (!otpInDb) {
        return { success: false };
    } // Consider adding a message in the response if needed
    if (otpInDb.userOtp !== enteredOtp) {
        return { success: false };
    }
    await userService.verifyUser(userId);
    await otpService.clearUserOtpObject(otpInDb._id);
    return { success: true };
};

export { otpService };
