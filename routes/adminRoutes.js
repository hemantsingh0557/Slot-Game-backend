import Joi from "joi";
import { ADMIN, PAYLINE_REEL_SYMBOL_COUNT } from "../utils/constants.js";
import { adminController } from "../controllers/adminController.js";

export const adminRoutes = [
    {
        method: "post",
        path: "/addNewSymbol",
        schema: {
            body: Joi.object({
                symbolCode: Joi.string().alphanum().required(), 
                symbolName: Joi.string().min(1).max(50).required(), 
                symbolImage: Joi.string().uri().required(), 
                symbolProbability: Joi.number().min(0.01).max(1).precision(2).required(), 
                description: Joi.string().optional(), 
            }),
        },
        auth: true,
        roles: [ADMIN],
        controller: adminController.addNewSymbol,
    } ,
    {
        method: "post",
        path: "/addPayline",
        schema: {
            body: Joi.object({
                reel1: Joi.array().items(Joi.number().integer().min(0)).length(PAYLINE_REEL_SYMBOL_COUNT).required(),
                reel2: Joi.array().items(Joi.number().integer().min(0)).length(PAYLINE_REEL_SYMBOL_COUNT).required(),
                reel3: Joi.array().items(Joi.number().integer().min(0)).length(PAYLINE_REEL_SYMBOL_COUNT).required(),
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







