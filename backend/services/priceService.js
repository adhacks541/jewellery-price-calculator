const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config();

// Cache TTL: 20 minutes (1200 seconds)
const cache = new NodeCache({ stdTTL: 1200, checkperiod: 120 });

const API_KEY = process.env.GOLD_API_KEY;
const GOLD_API_URL = 'https://www.goldapi.io/api';
const DIAMOND_BASE_RATE = parseFloat(process.env.DIAMOND_BASE_RATE) || 65000;

const HEADERS = {
    'x-access-token': API_KEY,
    'Content-Type': 'application/json'
};

const roundToTwo = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};

/**
 * Fetches live rates with robust fallback and caching strategy.
 */
const getRates = async () => {
    // 1. Check valid cache
    const cachedRates = cache.get('rates');
    if (cachedRates) {
        return { ...cachedRates, source: 'cache' };
    }

    try {
        console.log('Fetching live rates from GoldAPI...');

        // Fetch Gold (XAU) and Silver (XAG) in INR
        // Using Promise.all for parallel fetching
        const [goldResponse, silverResponse] = await Promise.all([
            axios.get(`${GOLD_API_URL}/XAU/INR`, { headers: HEADERS }),
            axios.get(`${GOLD_API_URL}/XAG/INR`, { headers: HEADERS })
        ]);

        const goldData = goldResponse.data;
        const silverData = silverResponse.data;

        // 2. Gram Parsing Logic with Priority
        // Priority: price_gram_24k -> price_gram_22k -> calculation from price (ounce)

        let gold24kPerGram, gold22kPerGram, gold18kPerGram;

        // XAU Endpoint usually returns per ounce price, sometimes per gram fields if plans allow.
        // We check for specific gram fields first.

        if (goldData.price_gram_24k) {
            gold24kPerGram = goldData.price_gram_24k;
        } else {
            // Fallback: price is per ounce. 1 Troy Ounce = 31.1034768 grams
            gold24kPerGram = goldData.price / 31.1034768;
        }

        // 22K Calculation
        if (goldData.price_gram_22k) {
            gold22kPerGram = goldData.price_gram_22k;
        } else {
            gold22kPerGram = gold24kPerGram * 0.916;
        }

        // 18K Calculation
        if (goldData.price_gram_18k) {
            gold18kPerGram = goldData.price_gram_18k;
        } else {
            gold18kPerGram = gold24kPerGram * 0.750;
        }

        let silverPerGram;
        if (silverData.price_gram_24k) { // Silver is usually 999 purity
            silverPerGram = silverData.price_gram_24k;
        } else {
            silverPerGram = silverData.price / 31.1034768;
        }

        const rates = {
            gold: {
                rate24k: roundToTwo(gold24kPerGram),
                rate22k: roundToTwo(gold22kPerGram),
                rate18k: roundToTwo(gold18kPerGram),
                currency: 'INR',
                unit: 'gram'
            },
            silver: {
                rate: roundToTwo(silverPerGram),
                currency: 'INR',
                unit: 'gram'
            },
            diamond: {
                basePricePerCarat: roundToTwo(DIAMOND_BASE_RATE),
                currency: 'INR',
                note: 'Approximate market value'
            },
            indicative: true,
            lastUpdated: new Date().toISOString()
        };

        // Cache the successful result
        cache.set('rates', rates);
        // Also save a persistent backup for stale fallback if needed (manually managed or just use same key with infinite manual check)
        // Ideally node-cache deletes it. We can set a secondary indefinite key for "last known good"
        cache.set('last_known_rates', rates, 0); // 0 = infinite TTL

        return { ...rates, source: 'live' };

    } catch (error) {
        console.error('API Fetch Error:', error.message);

        // 3. Stale Cache Fallback
        const lastKnown = cache.get('last_known_rates');
        if (lastKnown) {
            console.warn('Serving stale data due to API failure.');
            return { ...lastKnown, source: 'stale-cache' };
        }

        // No data available at all
        throw new Error('Failed to retrieve live rates and no cached data available.');
    }
};

module.exports = {
    getRates
};
