
import Joi from "joi" ;
import { gameController } from "../controllers/gameController.js";


export const gameRoutes = [
    {
        method : "post" ,
        path : "/executeSpin",
        schema : {
            body : Joi.object({
                betAmount : Joi.number().integer().min(1).required() ,
            }),
        } ,
        auth : true ,
        controller : gameController.executeSpin ,
    } ,
] ;