const { outcomes } = require('../Outcomes/outcomes');
const { MultiplierData } = require('../scripts/multipliers');

// const TOTAL_DROPS = 16;

// const MULTIPLIERS = {
//     0: 16,
//     1: 9,
//     2: 2,
//     3: 1.4,
//     4: 1.4,
//     5: 1.2,
//     6: 1.1,
//     7: 1,
//     8: 0.5,
//     9: 1,
//     10: 1.1,
//     11: 1.2,
//     12: 1.4,
//     13: 1.4,
//     14: 2,
//     15: 9,
//     16: 16
// };

const calculateGameOutcome = async (req, res) => {
    const { rows, risk } = req.body;

    if (!MultiplierData[risk]) {
        return res.status(400).json({ error: "Invalid risk level provided" });
    }

    if (!rows || rows < 8 || rows > 16) {
        return res.status(400).json({ error: "Invalid rows provided" });
    }

    let outcome = 0;
    const pattern = []
    for (let i = 0; i < rows; i++) {
        if (Math.random() > 0.5) {
            pattern.push("R")
            outcome++;
        } else {
            pattern.push("L")
        }
    }

    const multipliers = MultiplierData[risk][rows];

    if (!multipliers) {
        return res.status(400).json({ error: "Invalid number of rows for the specified risk" });
    }
    const multiplier = multipliers[outcome];
    const possibleOutcomes = outcomes[outcome];
    if (!possibleOutcomes || possibleOutcomes.length === 0) {
        return res.status(400).json({ error: "No possible outcomes found for the given outcome" });
    }
    // console.log("Outcome >>>>> ", outcome);
    // console.log("Multiplier >>>>> ", multiplier);
    // console.log("possiblieOutcomes >>>> ", possiblieOutcomes);
    // const point = possiblieOutcomes[Math.floor(Math.random() * possiblieOutcomes.length || 0)];
    // console.log("Point >>>> ", point);
    res.json({
        point: possibleOutcomes[Math.floor(Math.random() * possibleOutcomes.length || 0)],
        multiplier,
        pattern,
        rows,
        risk
    });
}



module.exports = {
    calculateGameOutcome
};