# 💎 Jewellery Price Calculator

A full-stack web application for calculating real-time jewellery prices based on live gold, silver, and diamond market rates. Built with a React (Vite) frontend and a Node.js/Express backend, it provides an instant, transparent pricing breakdown for each product — plus a shopping cart to collect your selections.

---

## ✨ Features

- **Live Market Rates** — Fetches up-to-date gold (18K/22K/24K), silver, and diamond prices via an external API, with server-side caching to reduce redundant calls.
- **Dynamic Price Calculation** — Instantly breaks down the cost into metal price, making charges, and GST using per-product configurable rates.
- **Curated Product Catalogue** — Includes gold jewellery (necklaces, chains, earrings, bangles) and diamond pieces (rings, bracelets), each with multiple images and individual making-charge percentages.
- **Product Details Page** — View full pricing breakdown, select purity/weight variants, and see the final price update in real time.
- **Shopping Cart** — Add items to a persistent cart (stored in `localStorage`), view a full line-item summary with price breakdowns, and clear the cart at checkout.
- **Custom React Hook** — `useRates` hook encapsulates the live-rate fetching logic for clean, reusable components.
- **Premium Dark UI** — React frontend styled with a glassmorphism dark theme, smooth animations, and a responsive grid layout.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 (Vite) | UI framework & build tool |
| React Router v7 | Client-side routing |
| Axios | HTTP requests |
| localStorage | Persistent cart storage |
| CSS (custom) | Glassmorphism dark design system |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| node-cache | In-memory rate caching |
| Axios | Upstream gold-rate API calls |
| dotenv | Environment configuration |

---

## 📦 Product Catalogue

| ID | Name | Type | Base Weight | Making Charges |
|---|---|---|---|---|
| GOLD-001 | Royal Temple Necklace | Gold 22K | 45 g | 18% |
| GOLD-002 | Minimalist Gold Chain | Gold 22K/18K | 12 g | 8% |
| GOLD-003 | Antique Jhumka Earrings | Gold 22K | 22 g | 15% |
| GOLD-004 | Hammered Gold Bangles | Gold 22K/18K | 30 g | 12% |
| DIAMOND-001 | Solitaire Diamond Ring | Diamond | 0.75 ct | 15% |
| DIAMOND-002 | Diamond Tennis Bracelet | Diamond | 2.5 ct | 20% |

---

## 💰 Price Calculation Formula

```
Base Price     = Unit Rate × Weight
Making Charges = Base Price × Making Charges %
Taxable Amount = Base Price + Making Charges
GST            = Taxable Amount × GST % (3%)
──────────────────────────────────────────────
Final Price    = Taxable Amount + GST
```

All prices are returned in **INR**.

---

## 🛒 Shopping Cart

Items added from the **Product Details** page are persisted in the browser's `localStorage`. The **Cart** page displays:

- Product image, name, and variant details (weight/purity or carat)
- Individual item price in INR
- A **View Breakdown** option to inspect metal price, making charges, and GST
- Running cart total and a **Checkout** button that clears the cart

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ installed
- A Gold Rate API key (configure in `backend/.env`)

### 1. Clone the Repository
```bash
git clone https://github.com/adhacks541/jewellery-price-calculator.git
cd jewellery-price-calculator
```

### 2. Backend Setup
```bash
cd backend
npm install
# Configure your environment (see Environment Variables below)
npm run dev
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the App
Navigate to `http://localhost:5173/` in your browser.

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5001
GOLD_API_KEY=your_api_key_here
MAKING_CHARGES_PERCENT=10   # Default making charges fallback (%)
GST_PERCENT=3               # Default GST rate (%)
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/rates` | Retrieve live gold, silver & diamond rates |
| `GET` | `/api/products` | List all jewellery products |
| `POST` | `/api/calculate` | Calculate price breakdown for a product |
| `GET` | `/health` | Backend health check |

### `POST /api/calculate` — Request Body
```json
{
  "type": "gold",
  "weight": 22,
  "purity": "22",
  "productId": "GOLD-003"
}
```

### `POST /api/calculate` — Sample Response
```json
{
  "success": true,
  "data": {
    "metalPrice": 142560.00,
    "makingCharges": 21384.00,
    "gst": 4918.32,
    "totalPrice": 168862.32,
    "unitRate": 6480,
    "currency": "INR"
  }
}
```

---

## 📁 Project Structure

```
jewellery-price-calculator/
├── backend/
│   ├── data/
│   │   └── products.js          # Product catalogue & config
│   ├── services/
│   │   ├── priceService.js      # Live rate fetching & caching
│   │   └── calculationService.js # Price breakdown logic
│   ├── server.js                # Express app & route definitions
│   └── .env                     # Environment variables (not committed)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductListing.jsx  # Product grid / catalogue
│   │   │   ├── ProductPage.jsx     # Product detail & price calculator
│   │   │   ├── Calculator.jsx      # Price calculation UI
│   │   │   ├── ImageGallery.jsx    # Product image carousel
│   │   │   └── Cart.jsx            # Shopping cart view
│   │   ├── hooks/
│   │   │   └── useRates.js         # Custom hook for live rates
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── vite.config.js
└── README.md
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
