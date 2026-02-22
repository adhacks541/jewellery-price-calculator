import React, { useState, useEffect } from 'react';
import useRates from '../hooks/useRates';
import axios from 'axios';
import '../App.css';

const Calculator = () => {
    const { rates, loading, error } = useRates();
    const [activeTab, setActiveTab] = useState('gold'); // 'gold' or 'diamond'

    // Inputs
    const [goldWeight, setGoldWeight] = useState('');
    const [goldPurity, setGoldPurity] = useState('22');
    const [diamondWeight, setDiamondWeight] = useState('');

    // Breakdown State
    const [breakdown, setBreakdown] = useState(null);

    // Calculate Price via Backend
    useEffect(() => {
        const calculate = async () => {
            if (!rates) return;

            let type = activeTab;
            let weight = type === 'gold' ? goldWeight : diamondWeight;
            let purity = type === 'gold' ? goldPurity : undefined;

            if (!weight || parseFloat(weight) <= 0) {
                setBreakdown(null);
                return;
            }

            try {
                const response = await axios.post('http://localhost:5001/api/calculate', {
                    type,
                    weight,
                    purity
                });

                if (response.data.success) {
                    setBreakdown(response.data.data);
                }
            } catch (err) {
                console.error("Calculation Error", err);
            }
        };

        const timer = setTimeout(calculate, 300); // Debounce
        return () => clearTimeout(timer);
    }, [goldWeight, goldPurity, diamondWeight, activeTab, rates]);

    if (loading) return <div className="loading">Updating Live Rates...</div>;
    if (error) return <div className="error">Error: {error}. Is the backend running?</div>;

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(val);
    };

    return (
        <div className="calculator-container">
            <header className="header">
                <h1>Jewellery Price Estimator</h1>
                <p className="subtitle">Live Rates (Indicative)</p>
            </header>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'gold' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('gold'); setBreakdown(null); }}
                >
                    Gold
                </button>
                <button
                    className={`tab ${activeTab === 'diamond' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('diamond'); setBreakdown(null); }}
                >
                    Diamond
                </button>
            </div>

            <div className="calculator-body">
                {activeTab === 'gold' && (
                    <div className="input-group fade-in">
                        <label>Weight (grams)</label>
                        <input
                            type="number"
                            value={goldWeight}
                            onChange={(e) => setGoldWeight(e.target.value)}
                            placeholder="e.g. 10"
                            min="0"
                        />

                        <label>Purity</label>
                        <div className="purity-options">
                            <button
                                className={goldPurity === '24' ? 'selected' : ''}
                                onClick={() => setGoldPurity('24')}
                            >24K</button>
                            <button
                                className={goldPurity === '22' ? 'selected' : ''}
                                onClick={() => setGoldPurity('22')}
                            >22K</button>
                            <button
                                className={goldPurity === '18' ? 'selected' : ''}
                                onClick={() => setGoldPurity('18')}
                            >18K</button>
                        </div>
                    </div>
                )}

                {activeTab === 'diamond' && (
                    <div className="input-group fade-in">
                        <label>Weight (Carats)</label>
                        <input
                            type="number"
                            value={diamondWeight}
                            onChange={(e) => setDiamondWeight(e.target.value)}
                            placeholder="e.g. 0.5"
                            min="0"
                            step="0.01"
                        />
                    </div>
                )}

                {breakdown && (
                    <div className="result-card fade-in">
                        <div className="breakdown-row">
                            <span>Metal Price</span>
                            <span>{formatCurrency(breakdown.metalPrice)}</span>
                        </div>
                        <div className="breakdown-row">
                            <span>Making Charges ({breakdown.breakdown.makingChargesPercent}%)</span>
                            <span>{formatCurrency(breakdown.makingCharges)}</span>
                        </div>
                        <div className="breakdown-row">
                            <span>GST ({breakdown.breakdown.gstPercent}%)</span>
                            <span>{formatCurrency(breakdown.gst)}</span>
                        </div>
                        <div className="divider"></div>
                        <div className="total-row">
                            <span>Final Estimate</span>
                            <h2>{formatCurrency(breakdown.totalPrice)}</h2>
                        </div>
                        <small className="rate-info">
                            Rate Used: {formatCurrency(breakdown.unitRate)}/{activeTab === 'gold' ? 'g' : 'ct'}
                        </small>
                    </div>
                )}
            </div>

            <footer className="footer">
                <p>Last Updated: {new Date(rates.lastUpdated).toLocaleTimeString()}</p>
                <p className="disclaimer">*Prices are indicative only and include estimated taxes/charges.</p>
            </footer>
        </div>
    );
};

export default Calculator;
