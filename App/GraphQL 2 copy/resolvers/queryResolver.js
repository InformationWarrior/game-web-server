const queryResolver = {
    Query: {
      players: async (_, __, { models }) => await models.Player.find(),
      games: async (_, __, { models }) => await models.Game.find(),
      game: async (_, { id }, { models }) => await models.Game.findById(id),
      getWheelSpinSelections: async (_, __, { models }) => await models.Selection.find(),
    },
  };
  
  module.exports = queryResolver;
  