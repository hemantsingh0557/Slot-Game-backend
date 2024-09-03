
import jwt from "jsonwebtoken" ; 
import { config } from "../config/index.js";
import { ALLOWED_FILE_EXTENTION, FILE_ERROR_MESSAGE } from "./constants.js";
import path from "path";



export const generateJWTAccessToken = (jwtPayloadObject) => {
    return jwt.sign(jwtPayloadObject, config.auth.jwtSecret , { algorithm: "HS256" , expiresIn: "600s" });
};

export function validateSchema(schema) {
    return (req , res , next ) => {
        if( schema.body ) {
            const { error } = schema.body.validate(req.body) ;
            if( error ) {
                res.status(400).json({
                    error : error.details.map( (err) => err.message ) ,
                }) ;
            }
        }
        if( schema.params ) {
            const { error } = schema.params.validate(req.params) ;
            if( error ) {
                res.status(400).json({
                    error : error.details.map( (err) => err.message ) ,
                }) ;
            }
        }
        if( schema.query ) {
            const { error } = schema.query.validate(req.query) ;
            if( error ) {
                res.status(400).json({
                    error : error.details.map( (err) => err.message ) ,
                }) ;
            }
        }
        if( schema.headers ) {
            const { error } = schema.headers.validate(req.headers) ;
            if( error ) {
                res.status(400).json({
                    error : error.details.map( (err) => err.message ) ,
                }) ;
            }
        }
        next() ;
    } ;
} ;






const validateFileExtension = (filename) => {
    const fileExtension = path.extname(filename).toLowerCase();
    return ALLOWED_FILE_EXTENTION.includes(fileExtension);
};

export const fileFilter = (req, file, cb) => {
    if (validateFileExtension(file.originalname)) {
        cb(null, true); 
    } 
    else {
        cb(new Error(FILE_ERROR_MESSAGE), false); 
    }
};















