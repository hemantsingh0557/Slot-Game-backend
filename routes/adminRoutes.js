import Joi from "joi";
import { ADMIN } from "../utils/constants.js";
import { adminController } from "../controllers/adminController.js";

export const adminRoutes = [
    {
        method: "post",
        path: "/addPayline",
        schema: {
            body: Joi.object({
                reel1: Joi.array().items(Joi.number().integer().min(0)).required(),
                reel2: Joi.array().items(Joi.number().integer().min(0)).required(),
                reel3: Joi.array().items(Joi.number().integer().min(0)).required(),
                payoutMultiplier: Joi.number().integer().min(1).required(), 
                description : Joi.string() ,
            }),
        },
        auth: true,
        roles: [ADMIN],
        controller: adminController.addPayline,
    },
    {
        method: "get",
        path: "/getAllPayline",
        auth: true,
        roles: [ADMIN],
        controller: adminController.getAllPayline,
    },
    {
        method: "put",
        path: "/updatePayline/:paylineId",
        schema: {
            params: Joi.object({
                paylineId: Joi.string().hex().length(24).required(),
            }),
            body: Joi.object({
                reel1: Joi.array().items(Joi.number().integer().min(0)).required(),
                reel2: Joi.array().items(Joi.number().integer().min(0)).required(),
                reel3: Joi.array().items(Joi.number().integer().min(0)).required(),
                payoutMultiplier: Joi.number().integer().min(1).required(), 
                description: Joi.string(),
            }),
        },
        auth: true,
        roles: [ADMIN],
        controller: adminController.updatePayline,
    } ,    
    {
        method: "delete",
        path: "/deletePayline/:paylineId",
        schema: {
            params: Joi.object({
                paylineId: Joi.string().hex().length(24).required(),
            }),
        },
        auth: true,
        roles: [ADMIN],
        controller: adminController.deletePayline,
    } ,
];
