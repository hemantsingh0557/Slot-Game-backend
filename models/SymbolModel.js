import mongoose from "mongoose";

const symbolSchema = new mongoose.Schema({
    symbolName: { type: String, required: true },
    symbolImage: { type: String, required: true },
    symbolProbability: { type: Number, required: true, min: 0.01, max: 1 }, 
    description: { type: String, default: "" }, 
}, { timestamps: true }); 

export const SymbolModel = mongoose.model("Symbol", symbolSchema);
