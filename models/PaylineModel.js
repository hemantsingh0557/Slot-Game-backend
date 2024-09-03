import mongoose from "mongoose";

const paylineCellSchema = new mongoose.Schema({
    cellPosition: { 
        type: String, 
        required: true ,
    },
    symbolId: { 
        type: String, 
        required: true ,
    } ,
});

const paylineSchema = new mongoose.Schema({
    paylineName: {
        type: String,
        required: true,
    },
    paylineCells: [paylineCellSchema], 
    payoutMultiplier: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
});

export const PaylineModel = mongoose.model("Payline", paylineSchema);
