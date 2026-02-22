import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ImageGallery from './ImageGallery';

const ProductPage = () => {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loadingProduct, setLoadingProduct] = useState(true);

    const [weight, setWeight] = useState(0);
    const [purity, setPurity] = useState(null);
    const [priceData, setPriceData] = useState(null);
    const [calculating, setCalculating] = useState(false);
    const [showBreakdown, setShowBreakdown] = useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/products');
                if (res.data.success) {
                    const found = res.data.data.find(p => p.id === id);
                    if (found) {
                        setProduct(found);
                        setWeight(found.baseWeight);
                        if (found.purities && found.purities.length > 0) {
                            setPurity(found.purities[0]);
                        }
                    }
                }
            } catch (e) { console.error(e); }
            finally { setLoadingProduct(false); }
        };
        loadProduct();
    }, [id]);

    useEffect(() => {
        if (!product || !weight) return;

        const fetchPrice = async () => {
            setCalculating(true);
            try {
                const response = await axios.post('http://localhost:5001/api/calculate', {
                    type: product.type,
                    weight: parseFloat(weight),
                    purity: purity,
                    productId: product.id
                });
                if (response.data.success) {
                    setPriceData(response.data.data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setCalculating(false);
            }
        };

        const timer = setTimeout(fetchPrice, 300);
        return () => clearTimeout(timer);

    }, [weight, purity, product]);

    const handleAddToCart = () => {
        alert("Demo Mode: Product added to simulated cart. Price: " + (priceData ? formatCurrency(priceData.totalPrice) : 'N/A'));
    };

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(val);

    if (loadingProduct) return <div style={{ padding: '2rem' }}>Loading...</div>;
    if (!product) return <div style={{ padding: '2rem' }}>Product Not Found</div>;

    const images = product.images || [product.image];

    return (
        <div className="detail-layout">
            <div className="gallery-section">
                <ImageGallery images={images} />
            </div>

            <div className="info-section">
                <h1>{product.name}</h1>
                <p className="description">{product.description}</p>

                <div className="price-block">
                    <div className="price-main">
                        {calculating ? (
                            <span style={{ opacity: 0.5 }}>Updating...</span>
                        ) : (
                            priceData ? formatCurrency(priceData.totalPrice) : '---'
                        )}
                    </div>
                    <div className="price-meta">
                        <span className="live-dot"></span>
                        Indicative Price based on Live Rates
                    </div>
                </div>

                <div className="config-form">
                    {product.type === 'gold' && (
                        <div className="form-group">
                            <label className="label">Select Purity</label>
                            <div className="purity-opts">
                                {product.purities.map(p => (
                                    <button
                                        key={p}
                                        className={`opt-btn ${purity === p ? 'active' : ''}`}
                                        onClick={() => setPurity(p)}
                                    >
                                        {p}K
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="label">Net Weight ({product.type === 'gold' ? 'grams' : 'carat'})</label>
                        <input
                            type="number"
                            className="input-weight"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                    </div>

                    <button
                        className="add-btn"
                        onClick={handleAddToCart}
                        disabled={!priceData}
                    >
                        Add to Cart (Demo)
                    </button>

                    {priceData && (
                        <div className="breakdown">
                            <button
                                className={`breakdown-toggle ${showBreakdown ? 'open' : ''}`}
                                onClick={() => setShowBreakdown(!showBreakdown)}
                            >
                                {showBreakdown ? 'Hide Price Breakdown' : 'View Price Breakdown'}
                            </button>

                            {showBreakdown && (
                                <div className="breakdown-list">
                                    <div className="breakdown-item">
                                        <span>Metal Price</span>
                                        <span>{formatCurrency(priceData.metalPrice)}</span>
                                    </div>
                                    <div className="breakdown-item">
                                        <span>Making Charges</span>
                                        <span>{formatCurrency(priceData.makingCharges)}</span>
                                    </div>
                                    <div className="breakdown-item">
                                        <span>GST (3%)</span>
                                        <span>{formatCurrency(priceData.gst)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
