const Player = require("../../../../models/player");

const createPlayer = async (walletAddress, username) => {
    try {
        let player = await Player.findOne({ walletAddress });

        if (player) {
            // Update the player if already exists
            player.username = username;
            await player.save();
            return player;
        } else {
            // Create a new player
            player = new Player({ walletAddress, username });
            console.log("Received createPlayer request:", walletAddress, username);
            await player.save();
            return player;
        }
    } catch (error) {
        throw new Error("Error creating player: " + error.message);
    }
};

const getPlayers = async () => {
    return await Player.find();
};

module.exports = {
    createPlayer,
    getPlayers,
};
