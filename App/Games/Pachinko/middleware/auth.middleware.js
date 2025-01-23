const { body } = require("express-validator");
const { MultiplierData } = require("../scripts/multipliers");

const validCurrencies = ["USDT", "YOLO", "ETH"];

const validateGameOutcome = [
    body("rows")
        .isInt({ min: 8, max: 16 })
        .withMessage("Rows must be an integer between 8 and 16."),

    body("risk")
        .custom((value) => !!MultiplierData[value])
        .withMessage("Invalid risk level provided."),

    body("currency")
        .isString()
        .withMessage("Currency must be a string.")
        .custom((value) => validCurrencies.includes(value))
        .withMessage("Invalid currency provided."),

    body("betAmount")
        .isNumeric()
        .withMessage("Bet amount must be a numeric value.")
        .custom((value) => value >= 0.01)
        .withMessage("Bet amount must be at least 0.01."),
];

module.exports = {
    validateGameOutcome,
};
