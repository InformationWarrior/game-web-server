const getWheelSpinSelections = require('./wheelSpin.resolver').getWheelSpinSelections;
const queryResolver = {
    Query: {
        getWheelSpinSelections,
    },
};

module.exports = queryResolver;
