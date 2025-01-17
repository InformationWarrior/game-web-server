const { outcomes } = require("../Outcomes/outcomes");
const { MultiplierData } = require("../scripts/multipliers");
const { validationResult } = require("express-validator");

let CREDITS = 10000.0;

const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return null;
};

const calculateGameOutcome = async (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { rows, risk, betAmount, currency } = req.body;

    if (betAmount > CREDITS) {
        return res
            .status(400)
            .json({ error: "Insufficient credits for the specified bet amount." });
    }

    CREDITS -= betAmount;

    let outcome = 0;
    const pattern = Array.from({ length: rows }, () => {
        if (Math.random() > 0.5) {
            outcome++;
            return "R";
        }
        return "L";
    });

    const multipliers = MultiplierData[risk]?.[rows];
    if (!multipliers) {
        return res
            .status(400)
            .json({ error: "Invalid number of rows for the specified risk level." });
    }

    const multiplier = multipliers[outcome] || 0;

    const possibleOutcomes = outcomes[outcome];
    if (!possibleOutcomes || possibleOutcomes.length === 0) {
        return res.status(400).json({
            error: "No possible outcomes found for the given game configuration.",
        });
    }

    const randomIndex = Math.floor(Math.random() * possibleOutcomes.length);
    const point = possibleOutcomes[randomIndex];

    const payout = +(multiplier * betAmount).toFixed(2);
    CREDITS += payout;

    CREDITS = +CREDITS.toFixed(2);

    const response = {
        point,
        multiplier,
        rows,
        risk,
        betAmount,
        payout,
        remainingCredits: CREDITS,
        currency,
        pattern,
    };

    console.log("Game Outcome Response: ", response);
    return res.json(response);
};

const getWallet = (req, res) => {
    try {
        res.json({
            remainingCredits: CREDITS.toFixed(2),
            currency: "USDT",
        });
    } catch (error) {
        console.error("Error fetching wallet data:", error);
        res.status(500).json({ error: "Failed to fetch wallet data" });
    }
};

module.exports = {
    calculateGameOutcome,
    getWallet
};
