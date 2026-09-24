# 🧅 Cebolão Conecta — AI-Powered Order Automation & Logistics Platform

<p align="left">
  <b>English</b> | <a href="./README.pt-BR.md">Português</a>
</p>

[![Deploy with Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=cebol-o-conecta)](https://cebol-o-conecta.vercel.app)
![Lovable](https://img.shields.io/badge/Generated_With-Lovable.dev-ff4b4b?logo=lovable)
![Google Antigravity](https://img.shields.io/badge/Agent_IDE-Google_Antigravity-4285F4?logo=google)
![Claude](https://img.shields.io/badge/AI_Pair-Claude%203.5-D97706?logo=anthropic)
![Gemini](https://img.shields.io/badge/AI_Pair-Gemini-4285F4?logo=google)
![Supabase](https://img.shields.io/badge/Backend-Supabase-3ecf8e?logo=supabase)
![Vercel](https://img.shields.io/badge/Hosting-Vercel-black?logo=vercel)

> **Full-Stack operational prototype built and orchestrated via AI-driven engineering tools (Lovable, Gemini & Antigravity) to solve real-world conversational sales and dispatch friction in grocery retail.**

🔗 **[Live Demo](https://cebol-o-conecta.vercel.app)**

> 💡 *Note: The point-of-sale operator PIN gate has been bypassed in this public live preview to allow frictionless testing and portfolio evaluation.*

---

## 📌 Business Context & The Problem

In local grocery stores and produce retail, WhatsApp serves as the primary sales channel. However, it creates severe operational bottlenecks:
- **High-latency manual processing:** Operators manually transcribe items line-by-line during peak hours.
- **Change calculation & delivery discrepancies:** Human errors in calculating cash change and delivery fees cause daily cash register mismatches.
- **Order picking blindspots:** Lost paper tickets and friction when dispatching orders to delivery drivers.
- **Stockout friction:** Customer frustration when requesting out-of-stock products without immediate alternative suggestions.

**Cebolão Conecta** was conceptualized and orchestrated as an end-to-end prototype uniting a **conversational heuristic ordering assistant**, a **real-time dispatch board**, and a **dynamic product catalog**.

---

## 🏗 System Workflow

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
```
## 🤖 AI Orchestration & Tooling Stack

This product was brought from operational concept to live production by leveraging state-of-the-art AI generation platforms, prompt engineering, and managed cloud primitives:

| Layer | Tool / Engine | Strategic Function |
|---|---|---|
| **AI Product Generation** | **Lovable.dev** | Full-stack scaffolding, React component synthesis, UI layouts, and state management. |
| **Agent Workspace & IDE** | **Google Antigravity** | Agentic workflows, task execution, environment orchestration, and iterative multi-file generation. |
| **Logic & Architecture** | **Claude & Gemini** | Iterative prompt crafting, heuristic parsing workflows, code refinement, and state machine architecture. |
| **Database & Auth** | **Supabase / PostgreSQL** | Managed relational data store, order persistence, and cloud storage. |
| **Deployment & CI/CD** | **Vercel** | Edge production hosting and automatic Git-integrated deployments. |

---

## ✨ Product Highlights & Functional Modules

### 1. Conversational Order Engine
- **Heuristic NLP Parsing:** Converts informal messages into structured cart objects (`"2kg potato, 1 oil, and 500g onions"` ➔ structured item checklist).
- **Out-of-Stock Substitution:** Automated logic that detects unavailable items and recommends catalog alternatives to prevent cart abandonment.
- **Human Handover Protocol:** Distinguishes transactional self-service orders from manual questions, routing complex tickets to a *Pending Chats* queue with multi-frequency web audio alerts.

### 2. Merchant Dispatch & Kanban Operations
- **Fulfillment Pipeline:** Structured transitions: `New Order` ➔ `In Preparation` ➔ `Out for Delivery` ➔ `Fulfilled`.
- **Automatic Change Calculation:** Real-time computation of cash change required for couriers based on the customer's specified bank note.
- **Thermal Receipt Printing:** CSS formatting tailored for standard 58mm and 80mm POS receipt printers with an integrated packing checklist.

### 3. Dynamic Catalog Management
- Direct price adjustment interface with currency masking and decimal normalization.
- Real-time stock toggle (`Available` / `Out of Stock`) reflected immediately across conversational answers.

---

## 👤 Built & Orchestrated by

**Isabella Boemer**  
*AI Product Builder & Operations Specialist*  
Focusing on solving operational business friction through AI-assisted software generation, workflow automation, and no-code/low-code tools.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/isabella-boemer)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Boemerisa)
[![Live Demo](https://img.shields.io/badge/Live_App-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://cebol-o-conecta.vercel.app)
