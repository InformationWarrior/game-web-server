const Player = require("../../models/player");

const getWallet = async (walletAddress) => {
    const player = await Player.findOne({ walletAddress });

    if (!player) {
        throw new Error("Player not found");
    }

    return {
        walletAddress: player.walletAddress,
        balance: player.balance,
        currency: "ETH", // Assuming a default currency for now
    };
};

module.exports = { getWallet };
