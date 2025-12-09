<div align="center">

# 🍽️ Table Tally

### **A Modern POS Demo with Gigstack Payment Integration**

*The easiest way to learn how to integrate Gigstack's Register Payment API into your React application*

[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=flat&logo=vite)](https://vitejs.dev/)
[![Gigstack](https://img.shields.io/badge/Gigstack-API%20v2-00d4aa?style=flat)](https://docs.gigstack.io/)

 [Gigstack Docs](https://docs.gigstack.io/register-payment-20352682e0) • [Report Bug](mailto:soporte@gigstack.io)

</div>

---

## 🚀 What is This?

**Table Tally** is a fully functional restaurant POS (Point of Sale) system built as a **demonstration project** to showcase how to integrate [Gigstack's Register Payment API](https://docs.gigstack.io/register-payment-20352682e0) into a modern React application.

This isn't just another TODO app — it's a **production-ready example** that shows you:

✅ How to structure API calls to Gigstack
✅ How to handle Mexican SAT-compliant payment forms
✅ How to implement automatic invoice generation
✅ How to manage payment metadata and client information
✅ Best practices for TypeScript + Axios integration

---

## ✨ Features

### 🏪 Restaurant POS System
- **Table Management**: Create and track multiple dining tables
- **Order Management**: Add/remove items with real-time total calculations
- **Payment Processing**: Complete transactions with cash, credit, or debit
- **Multi-Currency Support**: USD, EUR, MXN, GBP, CAD
- **Transaction History**: Review all closed tables and payments

### 💳 Gigstack Integration Highlights
- **Automatic Invoice Creation**: Generates PUE invoices automatically via Gigstack
- **SAT-Compliant Payment Forms**: Uses Mexican tax authority payment codes
- **Client Auto-Creation**: Automatically creates clients based on email
- **Payment Metadata**: Tracks order IDs and custom data
- **Tax Handling**: Properly configured IVA (VAT) tax integration
- **Error Handling**: Comprehensive error management for failed payments

---

## 🎯 Perfect For

- 🧑‍💻 **Developers** learning to integrate payment APIs
- 🏗️ **Teams** needing a reference implementation for Gigstack
- 📚 **Students** studying modern React patterns
- 🚀 **Startups** building Mexican e-commerce or POS solutions

---

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks |
| **TypeScript** | Type safety and better DX |
| **Vite** | Lightning-fast build tool |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Beautiful, accessible components |
| **Axios** | HTTP client for API calls |
| **React Hook Form** | Form state management |
| **Zod** | Schema validation |

---

## 🏃‍♂️ Quick Start

### Prerequisites

- **Node.js** 18+ and **npm** ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **Gigstack API Key** from [app.gigstack.pro/settings](https://app.gigstack.pro/settings)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/table-tally.git
cd table-tally

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# 4. Add your Gigstack API key to .env
# Edit .env and replace with your actual key:
# VITE_GIGSTACK_API_KEY="Bearer YOUR_API_KEY_HERE"

# 5. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and start exploring! 🎉

---

## 🔐 Environment Setup

Create a `.env` file in the project root:

```env
# Gigstack API Configuration
VITE_GIGSTACK_API_KEY="Bearer YOUR_API_KEY_HERE"
VITE_GIGSTACK_API_URL="https://api.gigstack.io/v2"
```

> 🔑 **Get Your API Key**: Log in to [Gigstack Dashboard](https://app.gigstack.pro/settings) → Settings → API Keys

---

## 🎓 Understanding the Gigstack Integration

### The Hook: `useGigstack`

The core integration lives in [`src/hooks/useGigstack.ts`](/src/hooks/useGigstack.ts:43). Here's what it does:

```typescript
const { registerPayment, isLoading, error } = useGigstack();

// Register a payment with automatic invoice creation
const result = await registerPayment({
  client: {
    search: {
      on_value: "customer@example.com",
      on_key: "email",
      auto_create: true  // Creates client if they don't exist
    },
    name: "Table 5"
  },
  currency: "MXN",
  payment_form: "04",  // Credit card (SAT code)
  items: [
    {
      id: null,
      quantity: 2,
      description: "Tacos al Pastor",
      unit_price: 45.00,
      product_key: "50202306",  // SAT product classification
      unit_key: "H87",          // SAT unit of measure
      taxes: [{
        factor: "Tasa",
        inclusive: true,
        rate: 0.16,            // 16% IVA
        type: "IVA",
        withholding: false
      }]
    }
  ],
  metadata: {
    orderId: "table-5-20231115",
    source: "pos_system"
  }
});
```

### Payment Flow

1. **User selects payment method** in [`PaymentDialog.tsx`](/src/components/pos/PaymentDialog.tsx:1)
2. **Payment data is prepared** in [`Index.tsx`](/src/pages/Index.tsx:54) with SAT-compliant codes
3. **API call is made** via the `useGigstack` hook
4. **Invoice is auto-generated** by Gigstack's automation
5. **Success/error is handled** with toast notifications

### SAT Payment Form Codes

Mexican tax regulations require specific payment method codes. We map them in [`Index.tsx`](/src/pages/Index.tsx:13):

```typescript
const PAYMENT_FORM_CODES = {
  cash: "01",    // Efectivo (Cash)
  credit: "04",  // Tarjeta de crédito
  debit: "28"    // Tarjeta de débito
};
```

> 📖 **Learn More**: [SAT Payment Form Codes](https://www.sat.gob.mx/consultas/92764/comprobante-de-recepcion-de-pagos)

---

## 📁 Project Structure

```
table-tally/
├── src/
│   ├── components/
│   │   ├── pos/
│   │   │   ├── PaymentDialog.tsx       # Payment method selection UI
│   │   │   ├── OpenTablesView.tsx      # Active tables grid
│   │   │   ├── ClosedTablesView.tsx    # Transaction history
│   │   │   └── ...
│   │   └── ui/                         # shadcn/ui components
│   ├── hooks/
│   │   ├── useGigstack.ts             # 🌟 GIGSTACK INTEGRATION
│   │   └── usePOS.ts                   # POS state management
│   ├── types/
│   │   └── pos.ts                      # TypeScript interfaces
│   └── pages/
│       └── Index.tsx                   # Main POS interface
├── .env.example                        # Environment template
└── package.json
```

---

## 🧪 How to Test the Integration

### Test Flow 1: Basic Payment
1. Click **"New Table"** and create "Table 1"
2. Click **"View Details"** → Add items to the order
3. Click **"Pay Bill"** → Select payment method & currency
4. ✅ Payment is registered with Gigstack
5. 📄 Invoice is automatically generated

### Test Flow 2: With Client Email
1. Create a new table
2. Add items to the order
3. Enter customer email in payment dialog
4. ✅ Client is auto-created in Gigstack if they don't exist
5. 📧 Invoice can be sent to customer email

### Test Flow 3: Multi-Currency
1. Create a table and add items
2. Select different currencies (MXN, USD, EUR)
3. ✅ Payment amounts are converted correctly
4. 📄 Invoice reflects selected currency

---

## 🔍 Key Code Locations

| Feature | File | Lines |
|---------|------|-------|
| Gigstack Integration | [`src/hooks/useGigstack.ts`](/src/hooks/useGigstack.ts) | 43-87 |
| Payment Processing | [`src/pages/Index.tsx`](/src/pages/Index.tsx) | 54-120 |
| Payment UI | [`src/components/pos/PaymentDialog.tsx`](/src/components/pos/PaymentDialog.tsx) | 55-194 |
| SAT Payment Codes | [`src/pages/Index.tsx`](/src/pages/Index.tsx) | 13-17 |

---

## 🛠️ Development

```bash
# Start dev server with hot reload
npm run dev

# Type-check without building
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Gigstack API Reference

This project uses the **Register Payment** endpoint:

```
POST https://api.gigstack.io/v2/payments/register
```

**Key Features Used:**
- ✅ Automatic PUE invoice generation (`automation_type: "pue_invoice"`)
- ✅ Client search and auto-creation
- ✅ Multi-item transactions with tax calculations
- ✅ Metadata for order tracking
- ✅ Multi-currency support

**Full Documentation**: [Gigstack Register Payment Docs](https://docs.gigstack.io/register-payment-20352682e0)

---

## 🤝 Contributing

Contributions are welcome! This is a learning resource, so improvements that make the integration clearer are especially valuable.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-improvement`)
3. Commit your changes (`git commit -m 'Add some amazing improvement'`)
4. Push to the branch (`git push origin feature/amazing-improvement`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Gigstack** for their excellent payment API and documentation
- **shadcn/ui** for beautiful React components
- **Vercel** for Vite and development tools
- The **React** community for amazing libraries and patterns

---

## 💬 Questions or Issues?

- 📖 **Gigstack Docs**: https://docs.gigstack.io/
- 🐛 **Report Bugs**: [GitHub Issues](https://github.com/yourusername/table-tally/issues)
- 💬 **Gigstack Support**: Contact through their dashboard

---

<div align="center">

**Built with ❤️ as a learning resource for the developer community**

⭐ **Star this repo** if you found it helpful! ⭐

</div>
