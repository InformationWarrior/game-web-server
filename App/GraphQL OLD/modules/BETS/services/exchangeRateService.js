const axios = require("axios");

const cache = {
    rates: null,
    lastUpdated: 0
};

const EXCHANGE_API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,tether&vs_currencies=usd";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const fetchExchangeRates = async () => {
    try {
        const response = await axios.get(EXCHANGE_API_URL);
        const data = response.data;

        // Mapping response to our currency structure
        cache.rates = {
            ETH: data.ethereum?.usd || 0,
            BTC: data.bitcoin?.usd || 0,
            USDT: data.tether?.usd || 1, // USDT is usually $1
            BETS: 0.05 // Placeholder for BETS token
        };

        cache.lastUpdated = Date.now();
        console.log("Exchange rates updated:", cache.rates);
    } catch (error) {
        console.error("Error fetching exchange rates:", error.message);
    }
};

const getExchangeRates = async () => {
    if (!cache.rates || Date.now() - cache.lastUpdated > CACHE_TTL) {
        await fetchExchangeRates();
    }
    return cache.rates;
};

module.exports = { getExchangeRates };
