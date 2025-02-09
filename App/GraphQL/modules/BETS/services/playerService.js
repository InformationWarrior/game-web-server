const Player = require("../../../../models/player");

const createPlayer = async (walletAddress, username) => {
    let player = await Player.findOne({ walletAddress });

    if (!player) {
        player = new Player({ walletAddress, username });
        await player.save();
    }

    return player;
};

const getPlayers = async () => {
    return await Player.find();
};

module.exports = {
    createPlayer,
    getPlayers,
};
