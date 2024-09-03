import { UserModel } from "../models/userModel.js";



export const gameService = {} ;


gameService.processSpinGame = async(userId , betAmount) => {
    const user = await UserModel.findById(userId) ;
    if( user.userCredit < betAmount ) {
        return null ;
    }
} ;