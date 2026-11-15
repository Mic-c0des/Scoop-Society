
# Scoop Society

A simple ice cream storefront built with React, TypeScript, Cloudflare Workers, and Neon PostgreSQL.

## Tech Stack

- React + Vite
- TypeScript
- Cloudflare Workers
- Neon PostgreSQL
- Drizzle ORM
- Better Auth

## Features

- Browse available ice cream flavors
- Add flavors to a shopping cart
- Guest checkout
- Customer accounts and authentication
- Cash and Venmo payment options
- Loyalty points and purchase discounts
- Customer purchase history
- Admin dashboard for managing flavors and orders

## Project Structure

```text
scoop-society/
├── src/
│   ├── components/
│   ├── pages/
│   ├── api/
│   ├── App.tsx
│   └── main.tsx
│
├── worker/
│   ├── routes/
│   ├── db/
│   └── index.ts
│
├── drizzle/
├── public/
├── package.json
├── drizzle.config.ts
├── vite.config.ts
└── wrangler.jsonc
```

## Getting Started

### Requirements

- Node.js
- npm
- Neon PostgreSQL account
- Cloudflare account

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd scoop-society
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.dev.vars` file in the project root:

```env
DATABASE_URL=your_neon_connection_string
```

Never commit environment files or database credentials.

### Database Setup

Generate database migrations:

```bash
npm run db:generate
```

Apply migrations:

```bash
npm run db:migrate
```

### Development

Start the Vite development server:

```bash
npm run dev
```

For local Cloudflare Worker development, use:

```bash
npx wrangler dev
```

### Deployment

Build the frontend:

```bash
npm run build
```

Deploy to Cloudflare:

```bash
npx wrangler deploy
```

Configure `DATABASE_URL` as a Cloudflare Worker secret before deploying.

## Loyalty System

Customers earn 10 points per dollar spent.

- 100 points = $1 discount
- Maximum redemption: 25% of order subtotal
- Points are earned after payment is confirmed.
- Guest purchases do not earn loyalty points.

## Payment Methods

Orders support:

- Cash
- Venmo

Payments are manually verified and marked as paid through the admin dashboard.

## Admin

Administrators can:

- View all orders
- View individual order details
- Update order statuses
- Verify payments
- Manage available flavors

Admin access is restricted to authenticated users with administrator permissions.

## License

Private project. All rights reserved.
