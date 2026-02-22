# Jewellery Price Calculator

A full-stack web application designed for calculating real-time jewellery prices based on live gold rates. The application consists of a React frontend and a Node.js/Express backend that fetches live gold prices and provides a comprehensive pricing calculation engine.

## Features

- **Live Gold Rates:** Fetches real-time gold rates to ensure accurate pricing.
- **Dynamic Price Calculation:** Calculates jewellery prices instantly as weight, purity, and product types are adjusted.
- **Product Listing & Details:** Browse various jewellery items and view detailed pricing breakdowns for each product.
- **Modern UI:** Built with React and styled for an intuitive user experience.

## Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Routing:** React Router v7
- **Styling:** CSS
- **HTTP Client:** Axios

### Backend
- **Environment:** Node.js
- **Framework:** Express
- **Caching:** node-cache
- **HTTP Client:** Axios
- **Configuration:** dotenv

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- An API Key for a Gold Rate provider (if applicable, configure in backend `.env`).

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/adhacks541/jewellery-price-calculator.git
   cd jewellery-price-calculator
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file and add your environment variables (e.g., PORT=5001, API keys)
   npm run dev
   ```

3. **Frontend Setup:**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:5173/` (or the port specified by Vite).

## API Endpoints

- `GET /api/rates`: Retrieves the latest live gold rates.
- `GET /api/products`: Lists available jewellery products.
- `POST /api/calculate`: Computes the detailed price breakdown for a selected item and parameters.
- `GET /health`: Backend health check endpoint.

## License

This project is licensed under the MIT License.
