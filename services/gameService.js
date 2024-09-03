import { PaylineModel } from "../models/PaylineModel.js";
import { SymbolModel } from "../models/SymbolModel.js";
import { PAYLINE_REEL_SYMBOL_COUNT, REEL_SYMBOL_COUNT } from "../utils/constants.js";



export const gameService = {} ;


function generateReel(allSymbols) {
    const totalSymbols = allSymbols.length;
    const reel = [];
    for (let i = 0; i < REEL_SYMBOL_COUNT; i++) {
        const randomIndex = Math.floor(Math.random() * totalSymbols);
        reel.push(allSymbols[randomIndex]);
    }
    return reel;
}

async function checkPayline(finalOutCome, betAmount) {
 
    const allMatchedPaylines = await PaylineModel.aggregate([
        {
            $match: {
                $expr: {
                    $allElementsTrue: {
                        $map: {
                            input: "$paylineCells",
                            as: "singlePaylineCell",
                            in: { $in: [ "$$singlePaylineCell", finalOutCome ] } ,
                        } ,
                    } ,
                } ,
            } ,
        } ,
    ]);
    let totalReward = 0 ; 
    allMatchedPaylines.forEach((payline)=>{
        totalReward += betAmount * payline.payoutMultiplier ;
    }) ;
    return totalReward;
}
 
gameService.executeSpinInDb = async(userId , betAmount) => {
    const allSymbols = await SymbolModel.find({}) ; 
    const reel1 = generateReel( allSymbols ) ;
    const reel2 = generateReel( allSymbols ) ;
    const reel3 = generateReel( allSymbols ) ;
    const rangeForStopReel = REEL_SYMBOL_COUNT - PAYLINE_REEL_SYMBOL_COUNT ;
    const stopIndexReel1 = Math.floor( Math.random() * (rangeForStopReel + 1) ) ;
    const stopIndexReel2 = Math.floor( Math.random() * (rangeForStopReel + 1) ) ;
    const stopIndexReel3 = Math.floor( Math.random() * (rangeForStopReel + 1) ) ;

    const finalOutCome = [
        { cellPosition: "s10" , symbolId : reel1[stopIndexReel1].symbolId } ,
        { cellPosition: "s11" , symbolId : reel1[stopIndexReel1+1].symbolId } ,
        { cellPosition: "s12" , symbolId : reel1[stopIndexReel1+2].symbolId } ,

        { cellPosition: "s20" , symbolId : reel2[stopIndexReel2].symbolId } ,
        { cellPosition: "s21" , symbolId : reel2[stopIndexReel2+1].symbolId } ,
        { cellPosition: "s22" , symbolId : reel2[stopIndexReel2+2].symbolId } ,

        { cellPosition: "s30" , symbolId : reel3[stopIndexReel3].symbolId } ,
        { cellPosition: "s31" , symbolId : reel3[stopIndexReel3+1].symbolId } ,
        { cellPosition: "s32" , symbolId : reel3[stopIndexReel3+2].symbolId } ,
    ] ;

    const totalReward = await checkPayline( finalOutCome , betAmount ) ;
    const response = {
        reel1 ,
        reel2 ,
        reel3 ,
        stopIndexReel1 ,
        stopIndexReel2 ,
        stopIndexReel3 ,
        totalReward ,
    } ;
    return response ;
} ;