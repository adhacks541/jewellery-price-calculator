import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/rates';

const useRates = () => {
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await axios.get(API_URL);
                if (response.data.success) {
                    setRates(response.data.data);
                } else {
                    setError('Failed to fetch rates');
                }
            } catch (err) {
                setError(err.message || 'Error connecting to server');
            } finally {
                setLoading(false);
            }
        };

        fetchRates();

        // Refresh every 5 minutes
        const interval = setInterval(fetchRates, 300000);
        return () => clearInterval(interval);
    }, []);

    return { rates, loading, error };
};

export default useRates;
