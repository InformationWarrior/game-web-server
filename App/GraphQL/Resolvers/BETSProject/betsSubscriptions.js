const { withFilter } = require("graphql-subscriptions");
const pubsub = require('../../pubsub');

const betsSubscriptions = {
    gameStatusUpdated: {
        subscribe: () => pubsub.asyncIterator("GAME_STATUS_UPDATED")
    },

    playerParticipated: {
        subscribe: () => pubsub.asyncIterator(["PLAYER_PARTICIPATED"]),
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

    betPlaced: {
        subscribe: withFilter(
            () => pubsub.asyncIterator("BET_PLACED"),
            (payload, variables) => {
                return (
                    payload.betPlaced.game === variables.gameId &&
                    payload.betPlaced.player.walletAddress === variables.walletAddress
                );
            }
        ),
    },
};

module.exports = betsSubscriptions;