# 🧅 Cebolão Conecta — WhatsApp Order Automation & Real-Time Logistics Platform

<p align="left">
  <b>English</b> | <a href="./README.pt-BR.md">Português</a>
</p>

[![Deploy with Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=cebol-o-conecta)](https://cebol-o-conecta.vercel.app)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react)
![Supabase](https://img.shields.io/badge/Backend-Supabase%20%2F%20PostgreSQL-3ecf8e?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Style-TailwindCSS-38b2ac?logo=tailwind-css)

> **Full-Stack solution for conversational sales automation, real-time Kanban order management, and physical dispatch control for local grocery retail.**

🔗 **[Live Demo](https://cebol-o-conecta.vercel.app)**

> 💡 *Note: The point-of-sale operator PIN gate has been bypassed in this public live preview to allow frictionless testing and portfolio evaluation.*

---

## 📌 Business Context & The Core Problem

In local grocery stores and produce retail, WhatsApp serves as the primary sales channel. However, it creates severe operational bottlenecks:
- **High-latency manual processing:** Operators manually transcribe items line-by-line during peak hours.
- **Change calculation & delivery discrepancies:** Human errors in calculating cash change and delivery fees cause daily cash register mismatches.
- **Order picking blindspots:** Lost paper tickets and friction when dispatching orders to delivery drivers.
- **Stockout friction:** Customer frustration when requesting out-of-stock products without immediate alternative suggestions.

**Cebolão Conecta** was built to solve this end-to-end through a **conversational natural language engine**, a **real-time Kanban dispatch board**, and a **dynamic catalog management module**.

---

## 🏗 System Architecture

```text
                    ┌────────────────────────────────────────┐
                    │               CUSTOMERS                │
                    └───────────────────┬────────────────────┘
                                        │ (Inbound Messages / Orders)
                                        ▼
          ┌─────────────────────────────────────────────────────────┐
          │         CONVERSATIONAL ENGINE (Edge / Client)           │
          │   - Heuristic Tokenizer & Parser (Weights & Units)      │
          │   - Out-of-Stock Detection & Automated Substitution     │
          │   - Finite State Machine (Session FSM)                  │
          └─────────────────────┬─────────────────────┬─────────────┘
                                │                     │
                        (Order Persistence)    (Human Handover)
                                ▼                     ▼
          ┌─────────────────────────┐   ┌───────────────────────────┐
          │      TABLE: `orders`    │   │     `support_requests`    │
          │  - Fulfillment Status   │   │  - Queued human requests  │
          │  - Change / PIX Calc    │   │  - Audio push alerts      │
          └─────────────┬───────────┘   └─────────────┬─────────────┘
                        │                             │
                        └───────────────┬─────────────┘
                                        ▼
          ┌─────────────────────────────────────────────────────────┐
          │               MERCHANT OPERATIONS BOARD                 │
          │   - Kanban Workflow Engine (New Order ➔ Fulfilled)      │
          │   - Thermal Receipt Printing (58mm / 80mm CSS)          │
          │   - Multi-frequency Web Audio Alerts                    │
          └─────────────────────────────────────────────────────────┘

## ✨ Engineering Highlights & Core Features

### 1. Conversational Order Engine (`src/lib/bot.ts`)
- **Heuristic NLP Parser:** Parses unformatted natural language sentences into structured JSON item payloads (`"2kg potato, 1 oil, and 500g onions"` ➔ `[{ name, quantity: 2, unit: 'kg' }, ...]`).
- **Out-of-Stock Substitution Engine:** Detects unavailable products and automatically recommends items from the same category to prevent churn.
- **Human Handover Protocol:** Decouples transactional order processing from manual support queries, streaming escalation tickets to a dedicated *Pending Chats* queue with distinct audio indicators (660 Hz alert vs 880 Hz for new orders).

### 2. Operational Kanban & Dispatch Board (`src/routes/index.tsx`)
- **Order Pipeline:** Deterministic state transitions: `New Order` ➔ `In Preparation` ➔ `Out for Delivery` ➔ `Fulfilled`.
- **Dynamic Change Computation:** Real-time calculation showing exact cash change required for couriers based on the customer's specified bank note.
- **Thermal Receipt Printing:** Dedicated print stylesheets optimized for standard 58mm and 80mm POS receipt printers with an integrated packing checklist.

### 3. Dynamic Catalog Manager (`src/routes/catalogo.tsx`)
- Inline price editing with currency input masking and decimal normalization.
- Instant stock availability toggle (`Available` / `Out of Stock`) reflected immediately across bot conversational responses.

## 👤 Author

Built by **Isabella Boemer**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/isabella-boemer)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Boemerisa)
[![Live Demo](https://img.shields.io/badge/Live_App-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://cebol-o-conecta.vercel.app)
