const express = require('express');
const cors = require('cors');
require('dotenv').config();
const priceService = require('./services/priceService');
const calculationService = require('./services/calculationService');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/rates', async (req, res) => {
    try {
        const rates = await priceService.getRates();
        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            data: rates
        });
    } catch (error) {
        console.error('Error in /api/rates:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch rates',
            error: error.message
        });
    }
});

// Calculate Price Hook
app.post('/api/calculate', async (req, res) => {
    try {
        const { type, weight, purity, productId } = req.body;

        if (!type || !weight) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const breakdown = await calculationService.calculatePrice(type, parseFloat(weight), purity, productId);

        res.json({
            success: true,
            data: breakdown
        });
    } catch (error) {
        console.error('Error in /api/calculate:', error.message);
        res.status(500).json({
            success: false,
            message: 'Calculation failed',
            error: error.message
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Get All Products
app.get('/api/products', (req, res) => {
    // In a real app, this would query DB
    const products = require('./data/products');
    res.json({ success: true, data: products });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
