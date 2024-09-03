import mongoose from "mongoose";

const paylineSchema = new mongoose.Schema({
    // // here each reel length will be equal to PAYLINE_REEL_SYMBOL_COUNT (see in constant file)
    reel1: { 
        type: [Number], 
        required: true,
    },
    reel2: {
        type: [Number], 
        required: true,
    },
    reel3: {
        type: [Number], 
        required: true,
    },
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
