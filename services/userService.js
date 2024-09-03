import { UserModel } from "../models/userModel.js";

const userService = {};

userService.findUserByIdInDB = async(userId) => {
    return await userModel.findOne({ userId });
};
userService.findUserInDB = async(email, mobileNumber) => {
    return await userModel.findOne({ $or: [{ email: email }, { mobileNumber: mobileNumber }] });
};

userService.saveUser = async(userDetailsObject) => {
    const userDetails = new userModel(userDetailsObject);
    return await userDetails.save();
};

userService.verifyUser = async(userId) => {
    await userModel.findOneAndUpdate({ _id: userId }, { isOtpVerified: true }, { new: true });
};

userService.resetPasswordInDb = async(userId, hashedPassword) => {
    const user = await userModel.findById(userId);
    if (!user) {
        return { success: false, message: "User does not exist" };
    }
    user.password = hashedPassword;
    await user.save();
    return { success: true };
};

export { userService };
