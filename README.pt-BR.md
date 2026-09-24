# 🧅 Cebolão Conecta — Plataforma de Automação de Pedidos & Logística Criada com IA

<p align="left">
  <a href="./README.md">English</a> | <b>Português</b>
</p>

[![Deploy com Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=cebol-o-conecta)](https://cebol-o-conecta.vercel.app)
![Lovable](https://img.shields.io/badge/Gerado_Com-Lovable.dev-ff4b4b?logo=lovable)
![Google Antigravity](https://img.shields.io/badge/IDE_Agêntica-Google_Antigravity-4285F4?logo=google)
![Claude](https://img.shields.io/badge/AI_Pair-Claude%203.5-D97706?logo=anthropic)
![Gemini](https://img.shields.io/badge/AI_Pair-Gemini-4285F4?logo=google)
![Supabase](https://img.shields.io/badge/Backend-Supabase-3ecf8e?logo=supabase)
![Vercel](https://img.shields.io/badge/Hospedagem-Vercel-black?logo=vercel)

> **Protótipo operacional Full-Stack concebido e orquestrado através de ferramentas de engenharia assistida por IA (Lovable, Gemini e Claude) para solucionar atritos reais de vendas conversacionais e despacho no varejo local.**

🔗 **[Demonstração Online](https://cebol-o-conecta.vercel.app)**

> 💡 *Nota: A tela de PIN para operadores de balcão foi desativada nesta prévia pública para permitir testes imediatos e avaliação ágil de recrutadores e visitantes.*

---

## 📌 Contexto & O Problema Real

No varejo de hortifrúti e mercearias locais, o WhatsApp é o canal primário de vendas, porém gera gargalos operacionais críticos:
- **Atendimento manual demorado:** Digitação de pedidos item por item em horários de pico.
- **Erros de cálculo de troco e frete:** Desvios de caixa na entrega por erros manuais dos operadores.
- **Falta de visibilidade na separação:** Comandas perdidas em papel e atrito na comunicação com entregadores.
- **Ruptura de estoque mal comunicada:** Frustração de clientes ao pedir itens esgotados sem sugestões imediatas.

O **Cebolão Conecta** foi concebido e orquestrado de ponta a ponta unindo um **motor conversacional heurístico de pedidos**, um **painel operacional Kanban em tempo real** e um **módulo de catálogo dinâmico**.

---

## 🏗 Fluxo da Solução

```text
                    ┌────────────────────────────────────────┐
                    │                CLIENTES                │
                    └───────────────────┬────────────────────┘
                                        │ (Mensagens / Pedidos)
                                        ▼
          ┌─────────────────────────────────────────────────────────┐
          │          ENGINE CONVERSACIONAL (Edge / Client)          │
          │   - Tokenização e Parser Heurístico (Pesos & Unidades)  │
          │   - Detecção de Ruptura com Sugestão de Substitutos     │
          │   - Máquina de Estados Finitos (FSM da Sessão)          │
          └─────────────────────┬─────────────────────┬─────────────┘
                                │                     │
                       (Gravação de Pedido)   (Transbordo Humano)
                                ▼                     ▼
          ┌─────────────────────────┐   ┌───────────────────────────┐
          │      TABLE: `orders`    │   │     `support_requests`    │
          │  - Status de Expedição  │   │  - Atendimento em fila    │
          │  - Cálculo de Troco/Pix │   │  - Alertas sonoros push   │
          └─────────────┬───────────┘   └─────────────┬─────────────┘
                        │                             │
                        └───────────────┬─────────────┘
                                        ▼
          ┌─────────────────────────────────────────────────────────┐
          │               PAINEL OPERACIONAL LOJISTA                │
          │   - Kanban com Máquina de Estados (Novo ➔ Finalizado)   │
          │   - Impressão Térmica de Comanda (58mm / 80mm)          │
          │   - Alertas visuais e sonoros dedicados                 │
          └─────────────────────────────────────────────────────────┘
```
## 🤖 Orquestração de IA & Stack de Ferramentas

Este produto saiu do conceito operacional para o ar em produção através do direcionamento estratégico de plataformas de IA generativa, engenharia de contexto e serviços em nuvem:

| Camada | Ferramenta / Motor | Função Estratégica |
|---|---|---|
| **Geração de Produto com IA** | **Lovable.dev** | Estruturação full-stack, síntese de componentes React, telas e gestão de estado. |
| **Workspace & IDE Agêntica** | **Google Antigravity** | Orquestração do espaço de trabalho, execução de tarefas por agentes e ciclos de iteração. |
| **Lógica & Arquitetura** | **Claude & Gemini** | Engenharia de prompts, desenho de heurísticas de texto, refinamento e arquitetura de regras. |
| **Banco de Dados & Nuvem** | **Supabase / PostgreSQL** | Banco relacional gerenciado, persistência de pedidos e armazenamento em nuvem. |
| **Deploy & CI/CD** | **Vercel** | Hospedagem em edge e deploy automatizado integrado ao GitHub. |

---

## ✨ Destaques de Produto & Módulos Funcionais

### 1. Motor Conversacional de Pedidos
- **Parser Heurístico de Linguagem Natural:** Converte mensagens livres em itens estruturados de carrinho (`"2kg de batata, 1 óleo e 500g cebola"` ➔ checklist estruturado de produtos).
- **Resolução de Ruptura de Estoque:** Lógica automatizada que identifica itens em falta e recomenda substitutos da mesma categoria para evitar perda de venda.
- **Transbordo para Atendimento Humano:** Separa o fluxo transacional autônomo de dúvidas manuais, encaminhando chamados para a fila de *Conversas Pendentes* com alertas sonoros dedicados.

### 2. Painel de Despacho & Kanban Operacional
- **Pipeline de Separação:** Transição entre etapas: `Novo Pedido` ➔ `Em Separação` ➔ `Saiu para Entrega` ➔ `Finalizado`.
- **Cálculo de Troco Dinâmico:** Exibição imediata do valor exato de troco a ser levado pelo entregador com base na cédula informada pelo cliente.
- **Impressão Térmica de Comanda:** Formatação pronta para impressoras térmicas padrão 58mm e 80mm com lista de conferência (checklist).

### 3. Gestão de Catálogo Dinâmico
- Edição direta de preços com formatação monetária padronizada.
- Alternância rápida de disponibilidade (`Disponível` / `Esgotado`) refletida instantaneamente no atendimento conversacional.

---

## 👤 Desenvolvido & Orquestrado por

**Isabella Boemer**  
*AI Product Builder & Especialista em Soluções Digitais*  
Foco em resolver problemas reais de negócio através da geração de software assistida por IA, automação de fluxos operacionais e ferramentas no-code/low-code.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/isabella-boemer)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Boemerisa)
[![Demonstração](https://img.shields.io/badge/Aplicação_Live-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://cebol-o-conecta.vercel.app)
