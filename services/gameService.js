import { PaylineModel } from "../models/PaylineModel.js";
import { SymbolModel } from "../models/SymbolModel.js";
import { PAYLINE_REEL_SYMBOL_COUNT, REEL_SYMBOL_COUNT } from "../utils/constants.js";
import { userService } from "./userService.js";



export const gameService = {} ;

// for(let i=0; i<10; i++) {
//     const result = await simulateGame(100 , 5 ) ;
//     console.log( result ) ;
// }

// const simulateGame = async(numSpins, betAmount) => {
//     const allSymbols = await SymbolModel.find({});
    
//     let totalPayout = 0;

//     for (let i = 0; i < numSpins; i++) {
//         const reel1 = generateReel(allSymbols);
//         const reel2 = generateReel(allSymbols);
//         const reel3 = generateReel(allSymbols);

//         const rangeForStopReel = REEL_SYMBOL_COUNT - PAYLINE_REEL_SYMBOL_COUNT;
//         const stopIndexReel1 = Math.floor(Math.random() * (rangeForStopReel + 1));
//         const stopIndexReel2 = Math.floor(Math.random() * (rangeForStopReel + 1));
//         const stopIndexReel3 = Math.floor(Math.random() * (rangeForStopReel + 1));

//         const finalOutcome = [
//             { cellPosition: "s10", symbol: reel1[stopIndexReel1] },
//             { cellPosition: "s11", symbol: reel1[stopIndexReel1 + 1] },
//             { cellPosition: "s12", symbol: reel1[stopIndexReel1 + 2] },
//             { cellPosition: "s20", symbol: reel2[stopIndexReel2] },
//             { cellPosition: "s21", symbol: reel2[stopIndexReel2 + 1] },
//             { cellPosition: "s22", symbol: reel2[stopIndexReel2 + 2] },
//             { cellPosition: "s30", symbol: reel3[stopIndexReel3] },
//             { cellPosition: "s31", symbol: reel3[stopIndexReel3 + 1] },
//             { cellPosition: "s32", symbol: reel3[stopIndexReel3 + 2] },
//         ];

//         // Check payline
//         const payout = await checkPayline(finalOutcome, betAmount);
//         totalPayout += payout;
//     }

//     const totalBet = numSpins * betAmount;
//     const rtp = (totalPayout / totalBet) * 100; 

//     return { totalPayout, totalBet, rtp };
// };




function generateReel(allSymbols) {
    const nonWildcards = allSymbols.filter((symbol) => !symbol.isWildCard);
    const wildcards = allSymbols.filter((symbol) => symbol.isWildCard);

    const weightedNonWildcards = nonWildcards.map((symbol) => ({
        symbol: symbol,
        weight: symbol.symbolProbability , // Adjust the weight as needed
    }));
    const weightedWildcards = wildcards.map((symbol) => ({
        symbol: symbol,
        weight: symbol.symbolProbability , // Adjust as needed
    }));

    const totalWeightNonWildcards = weightedNonWildcards.reduce((sum, item) => sum + item.weight, 0);
    const totalWeightWildcards = weightedWildcards.reduce((sum, item) => sum + item.weight, 0);

    function pickSymbol(weightedSymbols, totalWeight) {
        const randomWeight = Math.random() * totalWeight;
        let accumulatedWeight = 0;
        for (const weightedSymbol of weightedSymbols) {
            accumulatedWeight += weightedSymbol.weight;
            if (randomWeight < accumulatedWeight) {
                return weightedSymbol.symbol;
            }
        }
    }
    const reel = [];
    for (let i = 0; i < REEL_SYMBOL_COUNT; i++) {
        const useWildcard = Math.random() < 40 ; 
        const weightedSymbols = useWildcard ? weightedWildcards : weightedNonWildcards;
        const totalWeight = useWildcard ? totalWeightWildcards : totalWeightNonWildcards;
        reel.push(pickSymbol(weightedSymbols, totalWeight));
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
    // const totalReward = allMatchedPaylines.reduce((acc, payline) => {
    //     return acc + (betAmount * payline.payoutMultiplier);
    // }, 0);
    let totalReward = 0 ;
    allMatchedPaylines.forEach((payline) => {
        totalReward = Math.max( totalReward , betAmount * payline.payoutMultiplier ) ;
    });
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
        { cellPosition: "s10", symbol: reel1[stopIndexReel1] },
        { cellPosition: "s11", symbol: reel1[stopIndexReel1 + 1] },
        { cellPosition: "s12", symbol: reel1[stopIndexReel1 + 2] },
        { cellPosition: "s20", symbol: reel2[stopIndexReel2] },
        { cellPosition: "s21", symbol: reel2[stopIndexReel2 + 1] },
        { cellPosition: "s22", symbol: reel2[stopIndexReel2 + 2] },
        { cellPosition: "s30", symbol: reel3[stopIndexReel3] },
        { cellPosition: "s31", symbol: reel3[stopIndexReel3 + 1] },
        { cellPosition: "s32", symbol: reel3[stopIndexReel3 + 2] },
    ];

    const totalReward = await checkPayline(finalOutCome, betAmount);
    const user = await userService.incrementUserCredits(userId, betAmount, totalReward);
    const response = {
        totalUserCredits: user.userCredit,
        totalReward,
        stopIndexReel1,
        stopIndexReel2,
        stopIndexReel3,
        reel1,
        reel2,
        reel3,
    };
    return response;


    // for(let i=0; i<10; i++) {
    //     const randomNumber = Math.floor(Math.random()*100) ;
    //     const result = await simulateGame(100 , randomNumber ) ;
    //     console.log( result ) ;
    // }
    // return 0 ;
};
