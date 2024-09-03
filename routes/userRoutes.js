
import Joi from "joi" ; 
import { userController } from "../controllers/userController.js";



export const userRoutes = [
    {
        method: "post",
        path : "/user/signUp",
        schema : {
            body : Joi.object({
                name: Joi.string().required(),   
                age : Joi.number().min(10).max(100) ,
                email: Joi.string().email().required(), 
                mobileNumber : Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required() ,
                password: Joi.string().min(4).required(), // // match: [/(?=.*[a-zA-Z])(?=.*\d)(?=.*\W)/, 'Password must contain at least one letter, one number, and one special character']
                confirmPassword : Joi.ref("password") ,
            }).required(),
        },
        auth : false ,
        imagesFiles : true ,
        controller : userController.userSignUp,
    },
    {
        method : "post" ,
        path : "/user/signIn",
        schema : {
            body: Joi.alternatives().try(
                Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().min(4).required(),
                }),
                Joi.object({
                    mobileNumber: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required(),
                }),
            ).required(),
        } ,
        auth : false ,
        controller : userController.userSignIn,
    } ,
    {
        method: "put",
        path: "/user/resetPassword",
        schema: {
            body: Joi.object({
                newPassword: Joi.string().min(4).required(),
                confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
            }).required(),
        },
        auth: false,
        controller: userController.resetPassword,
    } ,

] ;















