import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductListing = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/products');
                if (response.data.success) {
                    setProducts(response.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div className="listing-wrapper">
            <h1>Our Collection</h1>

            <div className="product-grid">
                {products.map(product => {
                    const thumb = product.images ? product.images[0] : product.image;
                    return (
                        <Link to={`/product/${product.id}`} key={product.id} className="product-card">
                            <div className="card-image-wrapper">
                                <img src={thumb} alt={product.name} />
                            </div>
                            <h3 className="card-title">{product.name}</h3>
                            <div className="card-action">View Details</div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductListing;
