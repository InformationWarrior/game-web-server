const Game = require('../../../models/game');
const Player = require('../../../models/player');

const queryResolver = {
    Query: {
        games: async () => await Game.find().populate('players'),
        game: async (_, { id }) => {
            const game = await Game.findById(id).populate('players');
            if (!game) throw new Error('Game not found');
            return game;
        },
        players: async () => await Player.find(),
        players: async (_, __, { models }) => await models.Player.find(),
        games: async (_, __, { models }) => await models.Game.find(),
        game: async (_, { id }, { models }) => await models.Game.findById(id),
        getWheelSpinSelections: async (_, __, { models }) => await models.Selection.find(),

        getWheelSpinSelections: async (_, __, { models }) => {
            return await models.Selection.find();
        },
    },
};

module.exports = queryResolver;