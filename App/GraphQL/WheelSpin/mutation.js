const pubsub = require("../pubsub");
//const { BET_PLACED } = require("./constants");

const mutationResolvers = {
    Mutation: {
        placeBet: async (_, { currency, betAmount, totalPlayerRounds }) => {
            try {
                const placedBet = {
                    _id: new Date().toISOString(), // Replace with actual DB ID
                    currency,
                    betAmount,
                    totalPlayerRounds,
                };

                console.log("Bet Placed:", placedBet);

                // Publish event for subscriptions
                pubsub.publish(BET_PLACED, { betPlaced: { success: true, message: "Bet placed!", bet: placedBet } });

                return {
                    success: true,
                    message: "Bet placed successfully!",
                    bet: placedBet,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Failed to place bet: ${error.message}`,
                };
            }
        },
    },
};

module.exports = mutationResolvers;
