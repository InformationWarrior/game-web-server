const Game = require('../../models/game');
const Player = require('../../models/player');

const mutationResolver = {
    Mutation: {
        joinGame: async (_, { gameId, name }, { io }) => {
            if (!name) throw new Error('Name is required');

            const game = await Game.findById(gameId);
            if (!game) throw new Error('No available game found');

            const player = new Player({ name, gameId: game._id });
            await player.save();

            game.players.push(player);
            await game.save();

            const gameData = await Game.findById(gameId).populate('players');
            io.emit('playerJoined', player);

            // pubsub.publish('PLAYER_JOINED', {
            //     playerJoined: {
            //         player,
            //         playerCount: updatedGame.players.length, // Sending total players count
            //     },
            // });

            return gameData;
        },

        createGame: async (_, { name }) => {
            const game = new Game();
            await game.save();

            const player = new Player({ name, gameId: game._id });
            await player.save();

            game.players.push(player);
            await game.save();

            return game;
        },

        makeMove: async (_, { gameId, move }, { io }) => {
            const game = await Game.findById(gameId).populate('players');
            if (!game) throw new Error('Game not found');

            const currentPlayer = game.players[game.currentPlayerIndex];
            const nextPlayerIndex =
                (game.currentPlayerIndex + 1) % game.players.length;

            game.moves.push({ playerId: currentPlayer._id, move });
            game.currentPlayerIndex = nextPlayerIndex;
            await game.save();

            io.emit('moveMade', game);
            return game;
        },

        addSelection: async (_, { betAmount, totalPlayerRounds, currency }, { models }) => {
            try {
                const newSelection = new models.Selection({ betAmount, totalPlayerRounds, currency });
                await newSelection.save();

                pubsub.publish("SELECTION_ADDED", { selectionAdded: newSelection });

                return {
                    success: true,
                    message: "Selection added successfully!",
                    selection: newSelection,
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Failed to add selection: ${error.message}`,
                };
            }
        },
    },
};

module.exports = mutationResolver;
