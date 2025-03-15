const Player = require("../../models/player"); // Ensure correct path to the Player model

const generateUniqueColor = async () => {
    const existingColors = await Player.find({}, "color").lean();
    const usedColors = new Set(existingColors.map((p) => p.color));

    let color;
    do {
        color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Generate random HEX color
    } while (usedColors.has(color)); // Ensure uniqueness

    return color;
};

module.exports = { generateUniqueColor };
