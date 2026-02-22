import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import ProductListing from './components/ProductListing';
import ProductPage from './components/ProductPage';
import './App.css';

function App() {
  const [liveRate, setLiveRate] = useState(null);

  useEffect(() => {
    // Fetch live rate for banner
    const fetchRate = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/rates');
        if (res.data.success && res.data.data.gold) {
          // Assuming 22K is the standard benchmark to show
          setLiveRate(res.data.data.gold.rate22k);
        }
      } catch (e) {
        console.error("Failed to fetch live rate for banner", e);
      }
    };
    fetchRate();
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(val);

  return (
    <Router>
      <div className="App">
        <div className="header-wrapper">
          {liveRate && (
            <div className="top-banner">
              Today's Gold Rate (22K): {formatCurrency(liveRate)}/g &bull; Live Updates Active
            </div>
          )}
          <header className="header">
            <div className="container nav-container">
              <Link to="/" className="brand">Jewellery Demo</Link>
              <nav className="nav-links">
                <Link to="/">Products</Link>
              </nav>
            </div>
          </header>
        </div>

        <main className="container">
          <Routes>
            <Route path="/" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="*" element={<ProductListing />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
