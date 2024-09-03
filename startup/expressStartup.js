
import express from "express" ;
import cors from "cors" ;
import { allRoutes } from "../routes/index.js";
import multer from "multer" ;
import path from "path";
import { fileFilter, validateSchema } from "../utils/helperFunctions.js";
import { authenticateToken } from "../services/authServer.js";
import { UPLOAD_FILES_DESTINATION } from "../utils/constants.js";
import { authorizeRole } from "../services/authorizeRole.js";

const storage = multer.diskStorage({
    destination : UPLOAD_FILES_DESTINATION ,
    filename : (res , file , cb) => {
        cb(null , file.fieldname + "-" + Date.now() + path.extname(file.originalname) ) ;
    } ,
}) ;

const upload = multer({
    storage : storage ,
    limits : 1000000 ,
    fileFilter : fileFilter , 
}).single("imageFile") ;




const handler = (controller) =>{
    return (req , res) => {
        const payload = {
            ...(res.body || {}) ,
            ...(res.params || {}) ,
            ...(res.query || {}) ,
            userId : req.userId ,
            files : req.files ,
        } ;
        controller(payload)
            .then(async(result) => {
                res.status(result.statusCode).json(result.data) ;
            })
            .catch(async(error) => {
                res.status(error.statusCode || 500 ).json({ message : error.message }) ;
            }) ;
    } ;
} ;

export async function expressStartUp(app) {
    app.use( express.json() ) ;
    app.use( cors() ) ;
    app.use( "filesFolder" , express.static("filesFolder") ) ;
    app.get("/", (req, res) => {
        res.send("This is the backend of the slot game.");
    });
    allRoutes.forEach( (route) => {
        const { method, path, schema = {}, auth = false, roles = [], controller, imagesFiles } = route;
        const middleware = [] ;
        if( schema ) {
            middleware.push(validateSchema(schema)) ;
        }
        if( auth ) {
            middleware.push(authenticateToken) ;
        }
        if (roles.length) {
            middleware.push(authorizeRole(...roles));
        }
        if( imagesFiles ) {
            middleware.push(upload) ;
        }
        app[method](path , ...middleware , handler(controller) ) ;
    }) ;
} ;












