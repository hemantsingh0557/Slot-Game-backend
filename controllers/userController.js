import { userService } from "../services/userService.js";
import bcrypt from "bcrypt";
import { generateJWTAccessToken } from "../utils/helperFunctions.js";
import { SALT_ROUNDS , ERROR_TYPES } from "../utils/constants.js";
import { RESPONSE_MESSAGE } from "../utils/messages.js";
import { createErrorResponse, createSuccessResponse } from "../utils/commonFunctions/responseUtils.js";

const userController = {};

userController.userSignUp = async(payload) => {
    const { name, age, email, mobileNumber, password } = payload;
    const normalizedEmail = email.toLowerCase();
    const existingUser = await userService.findUserInDB(normalizedEmail, mobileNumber);
    if (existingUser) {
        return createErrorResponse(RESPONSE_MESSAGE.USER_EXIST, ERROR_TYPES.ALREADY_EXISTS);
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUserDetails = {
        name,
        age,
        email: normalizedEmail,
        mobileNumber,
        password: hashedPassword,
        isOtpVerified: false,
    };
    const savedUserObj = await userService.saveUser(newUserDetails);
    return createSuccessResponse(RESPONSE_MESSAGE.SIGNED_UP, { userDetails: savedUserObj });
};

userController.userSignIn = async(payload) => {
    const { email, password, mobileNumber } = payload;
    const normalizedEmail = email ? email.toLowerCase() : null;
    const user = await userService.findUserInDB(normalizedEmail, mobileNumber);
    if (!user) {
        return createErrorResponse(RESPONSE_MESSAGE.USER_NOT_EXIST, ERROR_TYPES.DATA_NOT_FOUND);
    }
    if (normalizedEmail) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return createErrorResponse(RESPONSE_MESSAGE.PASSWORD_MISMATCH, ERROR_TYPES.BAD_REQUEST);
        }
    }
    if (!user.isOtpVerified || mobileNumber) {
        return createErrorResponse(RESPONSE_MESSAGE.VERIFY_OTP, ERROR_TYPES.FORBIDDEN, { email: normalizedEmail, mobileNumber });
    }
    const jwtPayloadObject = { userId: user._id, userRole: user.userRole };
    const token = generateJWTAccessToken(jwtPayloadObject);
    return createSuccessResponse(RESPONSE_MESSAGE.SIGNED_IN, { userDetails: user, token });
};

userController.resetPassword = async(payload) => {
    const { userId, newPassword } = payload;
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const resetResult = await userService.resetPasswordInDb(userId, hashedPassword);
    if (!resetResult.success) {
        return createErrorResponse(RESPONSE_MESSAGE.PASSWORD_RESET_FAILED, ERROR_TYPES.BAD_REQUEST);
    }
    return createSuccessResponse(RESPONSE_MESSAGE.PASSWORD_RESET, { userId });
};

export { userController };
