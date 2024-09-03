import Joi from "joi" ;


export const userRoutes = [
    {
        method : "path" ,
        path : "/user/signup" ,
        schema : {
            body : Joi.object({

            }) ,
        },
        auth : false ,
        // controller : userController.signup ,
    } ,
] ;