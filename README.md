# 🌾 Kisan Bazaar (Kissan Bazar)

> **Empowering Farmers. Strengthening Communities. Growing Together.**

Kisan Bazaar is a modern, AI-powered agricultural marketplace platform built to connect farmers directly with buyers (wholesalers, retailers, and consumers). By cutting out unnecessary middlemen, Kisan Bazaar enables farmers to get fair prices for their produce while giving buyers direct access to fresh crops with quality guarantees, real-time negotiation, and transparent tracking.

---

## ✨ Features

- 🛒 **Direct Crop Marketplace**: Browse and list high-quality agricultural produce with detailed specs, quality grades, location, harvest dates, and certification badges.
- 💬 **Live Negotiation & AI Assistant**: Direct chat interface between farmers and buyers powered by **Google Gemini AI** for smart price suggestions and counter-offer insights.
- 🔐 **Secure Authentication**: JWT-based server authentication with role management (Farmer / Buyer switchable profiles).
- 🚚 **Order Management & Logistics Tracking**: End-to-end status tracking from order confirmation to dispatch and final delivery.
- 💳 **Escrow Payment Simulation**: Integrated payment checkout with interactive confetti feedback and payment safety guarantees.
- ⭐ **Ratings & Reviews**: Transparent rating and feedback system for buyers and sellers to build trust within the community.
- 🌓 **Dark & Light Mode**: Seamless theme toggling with Tailwind CSS styling and local storage memory.
- 📱 **Responsive & Accessible UI**: Clean, modern design optimized for mobile phones, tablets, and desktop displays.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/) & [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Integration**: [@google/genai SDK](https://www.npmjs.com/package/@google/genai) (Google Gemini API)
- **Database**: 
  - [Dexie.js](https://dexie.org/) (Client-side IndexedDB ORM)
  - [SQLite3](https://www.sqlite.org/) (Server-side database storage)
- **Auth & Security**: [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **Utility**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.x or later)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/kissan-bazar.git
   cd kissan-bazar
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add your API keys:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the app in action.

---

## 📂 Project Structure

```text
Kissan Bazar/
├── app/                  # Next.js App Router pages and API routes
│   ├── api/              # Backend API endpoints (Auth, AI Chat, etc.)
│   ├── globals.css       # Global CSS styles & Tailwind directives
│   ├── layout.js         # Main layout wrapper
│   └── page.js           # Main application view & tab switcher
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── AddCropListing.jsx
│   │   ├── AdditionalFeaturesSection.jsx
│   │   ├── AuthModal.jsx
│   │   ├── DirectNegotiationChat.jsx
│   │   ├── ListingCatalog.jsx
│   │   ├── Navbar.jsx
│   │   ├── OrderTracking.jsx
│   │   ├── PaymentCheckoutModal.jsx
│   │   ├── PlaceOrderSummary.jsx
│   │   └── RateReviewModal.jsx
│   └── db/               # Client-side IndexedDB schema & seeds
├── public/               # Static assets and images
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the app in development mode at `localhost:3000` |
| `npm run build` | Builds the app for production optimization |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs Next.js ESLint checks |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/your-username/kissan-bazar/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
