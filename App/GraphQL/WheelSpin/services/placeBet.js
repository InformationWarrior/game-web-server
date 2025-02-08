async function placeBet({ currency, betAmount, totalPlayerRounds }) {
    try {
        const placedBet = {
            _id: new Date().toISOString(),
            currency,
            betAmount,
            totalPlayerRounds,
        };

        console.log("Bet Placed:", placedBet);

        return {
            success: true,
            message: "Bet placed successfully!",
        };
    } catch (error) {
        return {
            success: false,
            message: `Failed to place bet: ${error.message}`,
        };
    }
}

module.exports = { placeBet };
