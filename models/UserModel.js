
import mongoose from "mongoose" ;
import { ADMIN, REGULAR_USER } from "../utils/constants.js";

const userSchema = new mongoose.Schema({
    name : {
        type : String , 
        required:true,
    },
    age : {
        type : Number , 
        required:true ,
        min: [10 , "Age must be a greater than or equal to 10"], 
        max: [200, "Age must be less than or equal to 200"], 
    },
    email : {
        type : String , 
        required:true , 
        unique:true ,
        match: [/^[\w-]+@([\w-]+\.)+\w{2,4}$/, "Please enter a valid email address"],
    } ,
    mobileNumber: {
        type: String, 
        required: true,
        unique: true,
        match: [/^[6-9]\d{9}$/, "Please enter a valid mobile number"],
    },
    password: {
        type: String,
        required: true,
    },
    isOtpVerified: {
        type: Boolean,
        required: false ,
    } ,
    userRole :{
        type : String ,
        enum: [ ADMIN , REGULAR_USER ],
        default : REGULAR_USER ,
    },
} , { timestamps : true } );


export const UserModel = mongoose.model( "User" , userSchema) ;   

 








































