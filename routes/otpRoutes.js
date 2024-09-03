
import Joi from "joi" ;
import { otpController } from "../controllers/otpController.js";





const otpRoutes = [
    {
        method : "post" ,
        path : "/sendOtp" ,
        schema : {
            body: Joi.object({
                userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
                email: Joi.string().email().optional(),
                mobileNumber: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).optional(),
            }).or("email", "mobileNumber").required(),
        } ,
        controller : otpController.sendOtp, 
    } ,   
    {
        method: "post",
        path: "/verifyOtp",
        schema: {
            body: Joi.object({
                userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
                enteredOtp: Joi.string().pattern(/^[0-9]{6}/).required(),
            }).required(),
        },
        controller: otpController.verifyOtp,
    },

];
 

export { otpRoutes } ;

















