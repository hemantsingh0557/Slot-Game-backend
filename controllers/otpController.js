import { otpService } from "../services/otpService.js";
import { userService } from "../services/userService.js";
import { RESPONSE_MESSAGE } from "../utils/messages.js";
import { generateJWTAccessToken } from "../utils/helperFunctions.js";
import { ERROR_TYPES } from "../utils/constants.js";
import { createErrorResponse, createSuccessResponse } from "../utils/commonFunctions/responseHelper.js";

export const otpController = {};

// Send OTP
otpController.sendOtp = async(payload) => {
    const { userId, email } = payload;
    const user = await userService.findUserByIdInDB(userId);
    if (!user) {
        return createErrorResponse(RESPONSE_MESSAGE.USER_NOT_EXIST, ERROR_TYPES.DATA_NOT_FOUND);
    }
    const sentOtp = await otpService.sendOtp(userId, email);
    if (!sentOtp) {
        return createErrorResponse(RESPONSE_MESSAGE.FAILED_TO_SEND_OTP, ERROR_TYPES.INTERNAL_SERVER_ERROR);
    }
    return createSuccessResponse(RESPONSE_MESSAGE.OTP_SENT_SUCCESSFULLY, { userId });
};

// Verify OTP
otpController.verifyOtp = async(payload) => {
    const { userId, enteredOtp } = payload;
    const user = await userService.findUserByIdInDB(userId);
    if (!user) {
        return createErrorResponse(RESPONSE_MESSAGE.USER_NOT_EXIST, ERROR_TYPES.DATA_NOT_FOUND);
    }
    const verifyOtp = await otpService.verifyOtp(userId, enteredOtp);
    if (!verifyOtp.success) {
        return createErrorResponse(RESPONSE_MESSAGE.INVALID_OTP, ERROR_TYPES.BAD_REQUEST);
    }
    const jwtPayloadObject = { userId: userId };
    const token = generateJWTAccessToken(jwtPayloadObject);
    return createSuccessResponse(RESPONSE_MESSAGE.OTP_VERIFIED_SUCCESSFULLY, { userId, token });
};
