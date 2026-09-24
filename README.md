# 🧅 Cebolão Conecta — Plataforma Omnichannel de Pedidos & Operação Logística

[![Deploy com Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=cebol-o-conecta)](https://cebol-o-conecta.vercel.app)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react)
![Supabase](https://img.shields.io/badge/Backend-Supabase%20%2F%20PostgreSQL-3ecf8e?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Style-TailwindCSS-38b2ac?logo=tailwind-css)

> **Solução Full-Stack para automação de vendas conversacionais, gestão de pedidos em tempo real e controle de expedição física para varejo alimentício e hortifrúti.**

🔗 **Live Demo:** [https://cebol-o-conecta.vercel.app](https://cebol-o-conecta.vercel.app)  
📂 **Simulador WhatsApp:** [https://cebol-o-conecta.vercel.app/simulador](https://cebol-o-conecta.vercel.app/simulador)

---

## 📌 Contexto & O Problema Real

No varejo de hortifrúti e mercearias locais, o WhatsApp é o canal primário de vendas, porém gera gargalos operacionais críticos:
- **Atendimento manual demorado:** Digitação de pedidos item por item em horários de pico.
- **Erros de cálculo de troco e frete:** Desvios de caixa na entrega por erros de cálculo manual dos operadores.
- **Falta de visibilidade na separação:** Comandas perdidas em papel e atrito na comunicação com entregadores.
- **Ruptura de estoque mal comunicada:** Clientes frustrados ao pedir itens esgotados sem sugestões imediatas.

O **Cebolão Conecta** foi desenvolvido como uma solução de ponta a ponta que une um **motor conversacional de processamento de linguagem natural**, **painel operacional Kanban em tempo real** e **módulo de catálogo dinâmico**.

---

## 🏗 Arquitetura da Solução

                    ┌────────────────────────────────────────┐
                    │              CLIENTES                  │
                    └───────────────┬────────────────────────┘
                                    │ (Mensagens / Pedidos)
                                    ▼
         ┌─────────────────────────────────────────────────────────┐
         │            ENGINE CONVERSACIONAL (Edge / Client)         │
         │   - Tokenização e Parser Heurístico (Pesos & Unidades)  │
         │   - Detecção de Ruptura com Sugestão de Substitutos     │
         │   - Máquina de Estados Finitos (FSM da Sessão)          │
         └───────────────┬─────────────────────────┬───────────────┘
                         │                         │
              (Gravação de Pedido)         (Transbordo Humano)
                         ▼                         ▼
         ┌─────────────────────────┐     ┌─────────────────────────┐
         │     TABLE: `orders`     │     │ `support_requests`      │
         │  - Status de Expedição  │     │ - Atendimento em fila   │
         │  - Cálculo de Troco/Pix │     │ - Alertas sonoros push  │
         └───────────────┬─────────┘     └─────────┬───────────────┘
                         │                         │
                         └───────────┬─────────────┘
                                     ▼
         ┌─────────────────────────────────────────────────────────┐
         │               PAINEL OPERACIONAL LOJISTA                │
         │   - Kanban com Máquina de Estados (Novo ➔ Finalizado)   │
         │   - Impressão Térmica de Comanda (58mm / 80mm)          │
         │   - Alertas visuais e sonoros dedicados                 │
         └─────────────────────────────────────────────────────────┘

---

## ✨ Destaques de Engenharia & Funcionalidades

### 1. Motor Conversacional de Pedidos (`src/lib/bot.ts`)
- **Parser de Linguagem Natural Heurístico:** Converte frases informais em itens estruturados (`"2kg de batata, 1 óleo e 500g cebola"` ➔ `[{ name, quantity: 2, unit: 'kg' }, ...]`).
- **Resolução de Ruptura de Estoque (Out-of-Stock Engine):** Caso um item esteja indisponível, o motor notifica o cliente e sugere produtos correlatos da mesma categoria automaticamente.
- **Transbordo para Atendimento Humano:** Separação entre fluxo transacional de pedidos e chamados manuais, isolando solicitações na fila de *Conversas Pendentes* com alerta sonoro dedicado (660 Hz vs 880 Hz para pedidos).

### 2. Painel de Despacho & Kanban Operacional (`src/routes/index.tsx`)
- **Pipeline de Separação:** Transição entre `Novo Pedido` ➔ `Em Separação` ➔ `Saiu para Entrega` ➔ `Finalizado`.
- **Cálculo de Troco Dinâmico:** Destaque visual do valor exato de troco a ser enviado pelo entregador conforme a cédula informada pelo cliente.
- **Impressão de Comanda para Cupom Térmico:** CSS otimizado para impressoras térmicas padrão 58mm/80mm com lista de conferência (checklist).

### 3. Catálogo em Tempo Real (`src/routes/catalogo.tsx`)
- Edição inline de preços com prefixo monetário padronizado e tratamento de casas decimais.
- Alternância instantânea de disponibilidade (`Disponível` / `Esgotado`) refletida imediatamente no motor do bot.

---

## 🛠 Tech Stack & Ferramentas

| Camada | Tecnologia | Decisão Técnica |
|---|---|---|
| **Linguagem** | **TypeScript 5.x** | Tipagem estrita de schemas de pedidos, endereçamento e payloads de transação. |
| **Frontend** | **React 18 + TanStack Router** | Roteamento baseado em tipos (file-based routing) com code-splitting automático. |
| **Data Fetching** | **TanStack Query (React Query)** | Cache inteligente, mutações otimistas e sincronização de dados em background. |
| **Backend & DB** | **Supabase / PostgreSQL** | Persistência relacional, Row Level Security (RLS) e APIs performáticas. |
| **Estilização** | **Tailwind CSS + Radix UI** | Acessibilidade nativa (WAI-ARIA) via componentes shadcn/ui e design mobile-first. |
| **Deploy** | **Vercel** | CI/CD automático conectado à branch `main` com Edge Caching. |

---

## 🧪 Decisões de Engenharia & Resiliência

1. **Sanitização de Codificação UTF-8:** Tratamento estrito de caracteres especiais e acentuação em strings e mensagens automatizadas para evitar quebras em diferentes sistemas operacionais.
2. **Defensive Programming na Persistência:** Implementação de camadas de fallback (`try/catch` granulares) ao gravar itens de pedidos (`order_items`), assegurando que instabilidades temporárias de tabelas filhas nunca impeçam a gravação do pedido principal (`orders`).
3. **Ergonomia Operacional no Ponto de Venda:** Inputs numéricos com atributos `inputMode="decimal"` e touch targets generosos (`h-12`) voltados ao uso diário ágil em smartphones e tablets de balcão.

---

## 👤 Autora

Desenvolvido por **Isabella Boemer**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/isabella-boemer)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Boemerisa)
[![Live Demo](https://img.shields.io/badge/Aplicação_Live-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://cebol-o-conecta.vercel.app)
