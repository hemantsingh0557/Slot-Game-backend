import { UserModel } from "../models/userModel.js";

const userService = {};

userService.findUserByIdInDB = async(userId) => {
    return await UserModel.findOne({ userId });
};
userService.findUserInDB = async(email, mobileNumber) => {
    return await UserModel.findOne({ $or: [{ email: email }, { mobileNumber: mobileNumber }] });
};

userService.saveUser = async(userDetailsObject) => {
    const userDetails = new UserModel(userDetailsObject);
    return await userDetails.save();
};

userService.verifyUser = async(userId) => {
    await UserModel.findOneAndUpdate({ _id: userId }, { isOtpVerified: true }, { new: true });
};

userService.resetPasswordInDb = async(userId, hashedPassword) => {
    const user = await UserModel.findById(userId);
    if (!user) {
        return { success: false, message: "User does not exist" };
    }
    user.password = hashedPassword;
    await user.save();
    return { success: true };
};

export { userService };
