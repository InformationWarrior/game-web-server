const { withFilter } = require("graphql-subscriptions");
const pubsub = require('../../pubsub');

const betsSubscriptions = {
    gameStatusUpdated: {
        subscribe: () => pubsub.asyncIterator("GAME_STATUS_UPDATED")
    },

    playerParticipated: {
        subscribe: withFilter(
            () => pubsub.asyncIterator('PLAYER_PARTICIPATED'),
            (payload, variables) => {
                console.log("📢 Publishing PLAYER_PARTICIPATED:", payload); // ✅ Check logs
                return (
                    payload.playerParticipated.gameId === variables.gameId &&
                    payload.playerParticipated.walletAddress === variables.walletAddress
                );
            }
        ),
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
                console.log("🔍 Filtering subscription for:", variables);
                return payload.betPlaced.gameId === variables.gameId &&
                    payload.betPlaced.walletAddress === variables.walletAddress;
            }
        ),
    },
};

module.exports = betsSubscriptions;
