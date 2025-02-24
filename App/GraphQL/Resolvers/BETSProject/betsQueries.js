const { getEnteredPlayers, getParticipants, getBets, getAllGames, getBetHistoryByWallet } = require("../../Services/gameService");

const betsQueries = {
    getEnteredPlayers: async (_, { gameId }) => {
        return await getEnteredPlayers(gameId);
    },
    getParticipants: async (_, { gameId }) => {
        return await getParticipants(gameId);
    },
    getBets: async (_, { gameId }) => {
        return await getBets(gameId);
    },
    getAllGames: async () => {
        return await getAllGames()
    },
    getBetHistoryByWallet: async (_, { walletAddress }) => {
        return await getBetHistoryByWallet(walletAddress);
    }
};

module.exports = betsQueries;
