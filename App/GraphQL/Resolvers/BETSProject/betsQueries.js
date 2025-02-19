const { getEnteredPlayers } = require("../../Services/gameService");
const { getParticipants } = require("../../Services/gameService");

const betsQueries = {
    getEnteredPlayers: async (_, { gameId }) => {
        return await getEnteredPlayers(gameId);
    },
    getParticipants: async (_, { gameId }) => {
        return await getParticipants(gameId);
    },
};

module.exports = betsQueries;
