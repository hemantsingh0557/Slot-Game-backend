import { gameService } from "../services/gameService.js";
import { createErrorResponse, createSuccessResponse } from "../utils/commonFunctions/responseUtils.js";
import { ERROR_TYPES } from "../utils/constants.js";
import { RESPONSE_MESSAGE } from "../utils/messages.js";



export const gameController = {} ;

gameController.executeSpin = async(payload) => {
    const { userId , betAmount } = payload ;
    const result = await gameService.executeSpinInDb(userId, betAmount);
    if (!result || result.totalReward === undefined) {
        return createErrorResponse(RESPONSE_MESSAGE.SPIN_FAILED, ERROR_TYPES.INTERNAL_SERVER_ERROR);
    }
    if (result.totalReward === 0) {
        return createSuccessResponse(RESPONSE_MESSAGE.NO_WIN, result);
    }
    return createSuccessResponse(RESPONSE_MESSAGE.SPIN_COMPLETED, result);
} ;