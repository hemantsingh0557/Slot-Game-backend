import { PaylineModel } from "../models/PaylineModel.js";
import { SymbolModel } from "../models/SymbolModel.js";
import { PAYLINE_REEL_SYMBOL_COUNT, REEL_SYMBOL_COUNT } from "../utils/constants.js";
import { userService } from "./userService.js";



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
                            in: {
                                $cond: {
                                    if: {
                                        $anyElementTrue: {
                                            $map: {
                                                input: finalOutCome,
                                                as: "finalOutcomeSingleCell",
                                                in: {
                                                    $and: [
                                                        { $eq: ["$$singlePaylineCell.cellPosition", "$$finalOutcomeSingleCell.cellPosition"] },
                                                        {
                                                            $or: [
                                                                { $eq: ["$$singlePaylineCell.symbolId", "$$finalOutcomeSingleCell.symbol._id"] },
                                                                { $eq: ["$$finalOutcomeSingleCell.symbol.isWildCard", true] } , 
                                                            ],
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    }, 
                                    then: true,
                                    else: false,
                                },
                            },
                        },
                    },
                },
            },
        },
    ]);
    const totalReward = allMatchedPaylines.reduce((acc, payline) => {
        return acc + (betAmount * payline.payoutMultiplier);
    }, 0);
    return totalReward;
}


gameService.executeSpinInDb = async(userId, betAmount) => {
    const allSymbols = await SymbolModel.find({});
    const reel1 = generateReel(allSymbols);
    const reel2 = generateReel(allSymbols);
    const reel3 = generateReel(allSymbols);
    const rangeForStopReel = REEL_SYMBOL_COUNT - PAYLINE_REEL_SYMBOL_COUNT;
    const stopIndexReel1 = Math.floor(Math.random() * (rangeForStopReel + 1));
    const stopIndexReel2 = Math.floor(Math.random() * (rangeForStopReel + 1));
    const stopIndexReel3 = Math.floor(Math.random() * (rangeForStopReel + 1));
    const finalOutCome = [
        // // in reel1 of finalOutcome
        { cellPosition: "s10", symbol: reel1[stopIndexReel1] },
        { cellPosition: "s11", symbol: reel1[stopIndexReel1 + 1] },
        { cellPosition: "s12", symbol: reel1[stopIndexReel1 + 2] },
        // // in reel2 of finalOutcome
        { cellPosition: "s20", symbol: reel2[stopIndexReel2] },
        { cellPosition: "s21", symbol: reel2[stopIndexReel2 + 1] },
        { cellPosition: "s22", symbol: reel2[stopIndexReel2 + 2] },
        // // in reel3 of finalOutcome
        { cellPosition: "s30", symbol: reel3[stopIndexReel3] },
        { cellPosition: "s31", symbol: reel3[stopIndexReel3 + 1] },
        { cellPosition: "s32", symbol: reel3[stopIndexReel3 + 2] },
    ];
    const totalReward = await checkPayline(finalOutCome, betAmount);
    const user = await userService.incrementUserCredits(userId , betAmount , totalReward ) ;
    const response = {
        reel1,
        reel2,
        reel3,
        stopIndexReel1,
        stopIndexReel2,
        stopIndexReel3,
        totalReward,
        totalUserCredits : user.userCredit ,
    };
    return response;
};
