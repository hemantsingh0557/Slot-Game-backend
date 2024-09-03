
import express  from  "express" ;
import cors  from  "cors" ;
import { allRoutes } from "../routes/index.js";
import multer from "multer" ;
import path from "path";
import { validateSchema } from "../utils/helperFunctions.js";
import { authenticateToken } from "../services/authServer.js";

const storage = multer.diskStorage({
    destination : "" ,
    filename : (res , file , cb) => {
        cb(null , file.fieldname + "-" + Date.now() + path.extname(file.originalname) ) ;
    } ,
}) ;

const upload = multer({
    storage : storage ,
    limits : 1000000 ,
    // fileFilter : fileFilter 
}).single("imageFile") ;




const  handler = async(controller) => {
    return  (req ,res ) => {
        const payload = {
            ...(req.body || {} ) ,
            ...(req.params || {} ) ,
            ...(req.query || {} ) ,
            userID : req.userID ,
            files : req.files ,
        } ;
        controller(payload)
            .then( (result) => {
                res.status(result.statusCode).json(result.data) ;
            } )
            .catch((error) => {
                res.status(error.statusCode || 500 ).json({ message : error.message }) ;
            })
    }
} 

export async function expressStartUp(app) {
    app.use( express.json() ) ;
    app.use( cors() ) ;
    app.use( "public" , express.static("public") )
    app.get("/", (req, res) => {
        res.send("This is the backend of the slot game.");
    });
    allRoutes.forEach( (route) => {
        const {  method , path , schema , auth = false , controller , imagesFiles = false  } = route ;
        const middleware = [] ;
        if( schema ) {
            middleware.push(validateSchema(schema)) ;
        }
        if( auth ) {
            middleware.push(authenticateToken) ;
        }
        if( imagesFiles ) {
            middleware.push(upload) ;
        }
        app[method](path , ...middleware , handler(controller) ) ;
    })
}












