import { adminService } from "../services/adminService.js";
import { createErrorResponse, createSuccessResponse } from "../utils/commonFunctions/responseUtils.js";
import { ERROR_TYPES } from "../utils/constants.js";
import { RESPONSE_MESSAGE } from "../utils/messages.js";

export const adminController = {};

adminController.addNewSymbol = async(payload) => {
    const { symbolCode, symbolName, symbolImage, symbolProbability , description } = payload; 
    const savedNewSymbol = await adminService.addNewSymbolInDb({ symbolCode, symbolName, symbolImage, symbolProbability , description });
    if (!savedNewSymbol) {
        return createErrorResponse(RESPONSE_MESSAGE.NEW_SYMBOL_NOT_SAVED, ERROR_TYPES.INTERNAL_SERVER_ERROR);
    }
    return createSuccessResponse(RESPONSE_MESSAGE.NEW_SYMBOL_SAVED, savedNewSymbol);
};

adminController.addPayline = async(payload) => {
    const { reel1, reel2, reel3, payoutMultiplier , description } = payload; 
    const savePayline = await adminService.savePaylineToDb({ reel1, reel2, reel3, payoutMultiplier , description });
    if (!savePayline) {
        return createErrorResponse(RESPONSE_MESSAGE.PAYLINE_NOT_SAVED, ERROR_TYPES.INTERNAL_SERVER_ERROR);
    }
    return createSuccessResponse(RESPONSE_MESSAGE.PAYLINE_SAVED, savePayline);
};

adminController.getAllPayline = async() => {
    const allPaylines = await adminService.getAllPaylineFromDb();
    if (!allPaylines) {
        return createErrorResponse(RESPONSE_MESSAGE.PAYLINE_NOT_FOUND, ERROR_TYPES.INTERNAL_SERVER_ERROR);
    }
    if ( allPaylines.length === 0 ) {
        return createErrorResponse(RESPONSE_MESSAGE.PAYLINE_NOT_FOUND, ERROR_TYPES.DATA_NOT_FOUND);
    }
    return createSuccessResponse(RESPONSE_MESSAGE.PAYLINE_FETCHED, allPaylines);
};


adminController.updatePayline = async(payload) => {
    const { paylineId, reel1, reel2, reel3, payoutMultiplier, description } = payload.params;
    const updatedPayline = await adminService.updatePaylineInDb(paylineId, { reel1, reel2, reel3, payoutMultiplier, description });
    if (!updatedPayline) {
        return createErrorResponse(RESPONSE_MESSAGE.PAYLINE_NOT_FOUND, ERROR_TYPES.NOT_FOUND);
    }
    return createSuccessResponse(RESPONSE_MESSAGE.PAYLINE_UPDATED, updatedPayline);
};

adminController.deletePayline = async(payload) => {
    const { paylineId } = payload ; 
    const result = await adminService.deletePaylineFromDb(paylineId);
    if (!result) {
        return createErrorResponse(RESPONSE_MESSAGE.PAYLINE_NOT_FOUND, ERROR_TYPES.DATA_NOT_FOUND); 
    }
    return createSuccessResponse(RESPONSE_MESSAGE.PAYLINE_DELETED, result);
};