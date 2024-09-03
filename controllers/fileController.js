import { RESPONSE_MESSAGE } from "../utils/messages.js";
import { ERROR_TYPES } from "../utils/constants.js";
import { createErrorResponse, createSuccessResponse } from "../utils/commonFunctions/responseUtils.js" ;

export const fileController = {}; 

fileController.uploadFile = async(payload) => {
    const { files } = payload;
    if (!files || files.length === 0) {
        return createErrorResponse(RESPONSE_MESSAGE.NO_FILES_PROVIDED, ERROR_TYPES.BAD_REQUEST , null );
    }
    const filePaths = files.map((file) => file.path);
    if (filePaths.some((path) => path === null)) {
        return createErrorResponse(RESPONSE_MESSAGE.FAILED_TO_UPLOAD_FILE, ERROR_TYPES.BAD_REQUEST , null );
    }
    return createSuccessResponse(RESPONSE_MESSAGE.FILE_UPLOADED_SUCCESSFULLY, { filePaths });
} ;
