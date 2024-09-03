
import { PaylineModel } from "../models/PaylineModel.js" ;


export const adminService = {};

adminService.savePaylineToDb = async(paylineData) => {
    const newPayline = await PaylineModel(paylineData) ;
    const savedPayline = await newPayline.save();
    return savedPayline;
};


adminService.getAllPaylineFromDb = async() => {
    const allPaylines = await PaylineModel.find({}) ;
    return allPaylines;
};

adminService.updatePaylineInDb = async(paylineId, updateData) => {
    const updatedPayline = await PaylineModel.findByIdAndUpdate(paylineId, updateData, { new: true });
    return updatedPayline;
};

adminService.deletePaylineFromDb = async(paylineId) => {
    const result = await PaylineModel.findByIdAndDelete(paylineId);
    return result;
};