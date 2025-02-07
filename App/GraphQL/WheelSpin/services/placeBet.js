const pubsub = require("../../pubsub");
const { BET_PLACED } = require("../constants");

async function placeBet({ currency, betAmount, totalPlayerRounds }) {
    try {
        const placedBet = {
            _id: new Date().toISOString(),
            currency,
            betAmount,
            totalPlayerRounds,
        };

        console.log("Bet Placed:", placedBet);

        // Publish the event for subscriptions
        // pubsub.publish(BET_PLACED, {
        //     betPlaced: {
        //         success: true,
        //         message: "Bet placed!",
        //         bet: placedBet,
        //     },
        // });

        return {
            success: true,
            message: "Bet placed successfully!",
            bet: placeBet,
        };
    } catch (error) {
        return {
            success: false,
            message: `Failed to place bet: ${error.message}`,
        };
    }
}

module.exports = { placeBet };
