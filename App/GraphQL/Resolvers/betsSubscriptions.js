const { withFilter } = require("graphql-subscriptions");
const pubsub = require('../pubsub');

const betsSubscriptions = {
    gameStatusUpdated: {
        subscribe: () => pubsub.asyncIterator("GAME_STATUS_UPDATED")
    },

    playerEntered: {
        subscribe: withFilter(
            () => pubsub.asyncIterator('PLAYER_ENTERED'),
            (payload, variables) => {
                console.log("📢 Publishing PLAYER_ENTERED:", payload); // ✅ Check logs
                return (
                    payload.playerEntered.gameId === variables.gameId &&
                    payload.playerEntered.walletAddress === variables.walletAddress
                );
            }
        ),
    },

    roundUpdated: {
        subscribe: withFilter(
            () => pubsub.asyncIterator("ROUND_UPDATED"),
            (payload, variables) => payload.roundUpdated.gameId === variables.gameId
        ),
    },

    winnerDetermined: {
        subscribe: withFilter(
            () => pubsub.asyncIterator(["WINNER_DETERMINED"]),
            (payload, variables) => payload.winnerDetermined.gameId === variables.gameId
        ),
    },
};

module.exports = betsSubscriptions;