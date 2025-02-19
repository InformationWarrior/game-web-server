const { getGames, getGameById } = require("./services/gameService");
const { getPlayers } = require("./services/playerService");
const { getExchangeRates } = require("./services/exchangeRateService");

const queryResolver = {
    Query: {
        games: async () => {
            return await getGames();
        },

        game: async (_, { id }) => {
            return await getGameById(id);
        },

        players: async () => {
            return await getPlayers();
        },

        exchangeRates: async () => {
            return await getExchangeRates();
        },
    }
};

module.exports = queryResolver;
