import { gameService } from "../services/gameService.js";
import { createErrorResponse, createSuccessResponse } from "../utils/commonFunctions/responseUtils.js";
import { ERROR_TYPES } from "../utils/constants.js";
import { RESPONSE_MESSAGE } from "../utils/messages.js";



export const gameController = {} ;

gameController.spinGame = async(payload) => {
    const { userId , betAmount } = payload ;
    const result = await gameService.processSpinGame( userId , betAmount ) ;
    if( ! result ) {
        return createErrorResponse( RESPONSE_MESSAGE.SPIN_FAILED , ERROR_TYPES.INTERNAL_SERVER_ERROR ) ;
    } 
    if( result.length === 0 ) {
        return createErrorResponse( RESPONSE_MESSAGE.SPIN_COMPLETED , ERROR_TYPES.DATA_NOT_FOUND ) ;
    } 
    return createSuccessResponse( RESPONSE_MESSAGE.SPIN_COMPLETED , result ) ;
} ;

