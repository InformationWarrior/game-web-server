const { getEnteredPlayers, getParticipantsAndBets, getAllGames, getBetHistoryByWallet } = require("../../Services/gameService");
const { getRound } = require("../../Services/roundService");

const betsQueries = {
    getEnteredPlayers: async (_, { gameId }) => {
        return await getEnteredPlayers(gameId);
    },
    getParticipantsAndBets: async (_, { gameId }) => {
        return await getParticipantsAndBets(gameId);
    },
    getAllGames: async () => {
        return await getAllGames()
    },
    getBetHistoryByWallet: async (_, { walletAddress }) => {
        return await getBetHistoryByWallet(walletAddress);
    },
    getRound: async (_, { gameId, walletAddress }) => {
        return await getRound(gameId, walletAddress);
    }
};

module.exports = betsQueries;
