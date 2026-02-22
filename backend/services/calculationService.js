const priceService = require('./priceService');
const products = require('../data/products');
require('dotenv').config();

// Default Configuration
const DEFAULT_MAKING_CHARGES_PERCENT = parseFloat(process.env.MAKING_CHARGES_PERCENT) || 10;
const DEFAULT_GST_PERCENT = parseFloat(process.env.GST_PERCENT) || 3;

const roundToTwo = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};

/**
 * Calculates the detailed price breakdown.
 * Supports generic calculation OR product-specific calculation if productId is provided.
 */
const calculatePrice = async (type, weight, purity, productId = null) => {
    // 1. Fetch live rates
    const ratesData = await priceService.getRates();
    const rates = ratesData;

    // 2. Load Product Config if available
    let productConfig = null;
    if (productId) {
        productConfig = products.find(p => p.id === productId);
        if (!productConfig) {
            throw new Error(`Product not found: ${productId}`);
        }
        // Override type if product dictates it (sanity check)
        // type = productConfig.type; 
    }

    let unitRate = 0;
    let basePrice = 0;

    // 3. Determine Unit Rate
    if (type === 'gold') {
        const pKey = `rate${purity}k`;
        if (rates.gold && rates.gold[pKey]) {
            unitRate = rates.gold[pKey];
        } else {
            throw new Error(`Invalid gold purity: ${purity}`);
        }
    } else if (type === 'silver') {
        unitRate = rates.silver.rate;
    } else if (type === 'diamond') {
        unitRate = rates.diamond.basePricePerCarat;
    } else {
        throw new Error(`Invalid metal type: ${type}`);
    }

    // 4. Calculate Base Price
    basePrice = unitRate * weight;

    // 5. Calculate Making Charges
    // Use Product specific % if available, else default
    const makingPercent = productConfig ? productConfig.makingChargesPercent : DEFAULT_MAKING_CHARGES_PERCENT;
    const makingCharges = basePrice * (makingPercent / 100);

    // 6. Calculate Taxes (GST)
    const gstPercent = productConfig ? productConfig.gstPercent : DEFAULT_GST_PERCENT;
    const taxableAmount = basePrice + makingCharges;
    const gst = taxableAmount * (gstPercent / 100);

    // 7. Final Total
    const finalPrice = taxableAmount + gst;

    return {
        metalPrice: roundToTwo(basePrice),
        makingCharges: roundToTwo(makingCharges),
        gst: roundToTwo(gst),
        totalPrice: roundToTwo(finalPrice),
        unitRate: unitRate,
        breakdown: {
            metalRate: unitRate,
            weight: weight,
            makingChargesPercent: makingPercent,
            gstPercent: gstPercent,
            productId: productId || null
        },
        currency: 'INR'
    };
};

module.exports = {
    calculatePrice
};
