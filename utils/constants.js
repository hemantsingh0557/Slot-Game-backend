import path from "path";



export const ADMIN = "Admin" ;
export const REGULAR_USER = "RegularUser" ;




export const UPLOAD_FILES_DESTINATION = path.join(process.cwd(), "filesFolder");

export const SALT_ROUNDS = 10 ;


export const ERROR_TYPES = {
    DATA_NOT_FOUND: "DATA_NOT_FOUND",
    BAD_REQUEST: "BAD_REQUEST",
    ALREADY_EXISTS: "ALREADY_EXISTS",
    FORBIDDEN: "FORBIDDEN",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    UNAUTHORIZED: "UNAUTHORIZED",
};





export const ALLOWED_FILE_EXTENTION = [".jpg", ".jpeg", ".gif", ".png", ".pdf"] ; 
export const FILE_ERROR_MESSAGE = "Invalid file type. Only JPG, JPEG, GIF, PNG, and PDF files are allowed." ;








export const REEL_COUNT = 3 ; // // how many total reels in teh fronend
export const REEL_SYMBOL_COUNT = 10 ; // // how many symbols or obejcts in each reel
export const PAYLINE_REEL_SYMBOL_COUNT = 3 ; // // how many symbols or obejct in payline reel 


