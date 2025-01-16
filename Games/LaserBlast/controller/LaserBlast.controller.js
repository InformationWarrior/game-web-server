const { outcomes } = require("../Outcomes/outcomes");
const { MultiplierData } = require("../scripts/multipliers");
const { validationResult } = require("express-validator");

// Simulated wallet balance
let CREDITS = 10000;

/**
 * Handle validation errors from request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object|null} - Validation errors response or null
 */
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return null;
};

/**
 * Calculate the outcome of the game and return the result
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const calculateGameOutcome = async (req, res) => {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { rows, risk, currency, betAmount } = req.body;

    // Validate betAmount against available credits
    if (betAmount > CREDITS) {
        return res
            .status(400)
            .json({ error: "Insufficient credits for the specified bet amount." });
    }

    // Initialize outcome and game pattern
    let outcome = 0;
    const pattern = Array.from({ length: rows }, () => {
        if (Math.random() > 0.5) {
            outcome++;
            return "R"; // Right movement
        }
        return "L"; // Left movement
    });

    // Retrieve multipliers for the given risk and rows
    const multipliers = MultiplierData[risk]?.[rows];
    if (!multipliers) {
        return res
            .status(400)
            .json({ error: "Invalid number of rows for the specified risk level." });
    }

    const multiplier = multipliers[outcome] || 0;

    // Retrieve possible outcomes for the calculated outcome
    const possibleOutcomes = outcomes[outcome];
    if (!possibleOutcomes || possibleOutcomes.length === 0) {
        return res.status(400).json({
            error: "No possible outcomes found for the given game configuration.",
        });
    }

    // Randomly select a sink position (point)
    const randomIndex = Math.floor(Math.random() * possibleOutcomes.length);
    const point = possibleOutcomes[randomIndex];

    // Calculate payout and update credits
    const payout = Math.round(multiplier * betAmount); // Ensure payout is rounded
    CREDITS -= betAmount; // Deduct the bet amount
    CREDITS += payout; // Add the payout (if any)

    // Formulate the response
    const response = {
        point,
        multiplier,
        rows,
        risk,
        betAmount,
        currency,
        payout,
        remainingCredits: CREDITS, // Updated wallet balance
        pattern, // Path taken by the ball
    };

    console.log("Game Outcome Response: ", response);
    return res.json(response);
};

/**
 * Get the current wallet balance
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getWallet = (req, res) => {
    res.json({
        remainingCredits: CREDITS,
        currency: "USDT",
    });
};

module.exports = {
    calculateGameOutcome,
    getWallet,
};
