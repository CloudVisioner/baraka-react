# Baraka — Online Bookstore (Frontend)

React + TypeScript frontend for Baraka, an online bookstore with a manual payment-approval order flow. Pairs with the [baraka](https://github.com/CloudVisioner/baraka) Express backend.

## Features

- Product catalog and book details
- Cart and checkout flow
- Manual payment verification: customer uploads payment proof, admin approves or rejects before order ships
- Order status tracking (Awaiting Payment → Processing → Completed)
- Admin panel for order approval, products, and events
- Book of the Month feature
- Events page

## Tech stack

- **Frontend:** React, TypeScript, Redux Toolkit
- **Bootstrapped with:** Create React App
- **Backend:** [baraka](https://github.com/CloudVisioner/baraka) — Express, MongoDB, Socket.io (separate repo)

## Order status flow

PAUSE → PENDING → PROCESS → FINISH
↓
REJECTED (can re-upload)

- **PAUSE** — awaiting payment proof
- **PENDING** — proof uploaded, awaiting admin review
- **REJECTED** — proof rejected, customer can re-upload
- **PROCESS** — payment verified, order being fulfilled
- **FINISH** — order completed

## Setup

```bash
yarn install
yarn run start
```

Runs on `http://localhost:3000`. Requires the [backend](https://github.com/CloudVisioner/baraka) running on its configured port for full functionality.

## Related

- Backend repo: [baraka](https://github.com/CloudVisioner/baraka)

## Documentation

- [Orders API](./ORDERS_BACKEND_SPECIFICATION.md)
- [Events API](./EVENTS_API_SPECIFICATION.md)
- [Book of the Month](./BOOK_OF_THE_MONTH_BACKEND_SPECIFICATION.md)
