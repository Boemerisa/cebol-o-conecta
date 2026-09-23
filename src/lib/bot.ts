import { parseOrderText, sum } from "./parser";
import { brl, qtyLabel } from "./format";
import type { Address, OrderItem, PaymentMethod, Product } from "./types";

/** Taxa de entrega padrão da loja. */
export const DELIVERY_FEE = 5;

export const WELCOME_TEXT =
  "Olá! Seja muito bem-vindo(a) ao Cebolão Empório e Verdurão! 🥬🧅 Como podemos te ajudar hoje?";

export const WELCOME_BUTTONS = ["Fazer pedido", "Falar com atendente"];

export type BotStep =
  | "start"
  | "items"
  | "items_confirm"
  | "name"
  | "street"
  | "number"
  | "neighborhood"
  | "reference"
  | "payment"
  | "cash"
  | "confirm"
  | "done"
  | "human";

export interface BotState {
  step: BotStep;
  items: OrderItem[];
  address: Address;
  payment: PaymentMethod | null;
  cashFor: number | null;
}

export interface BotReply {
  text: string;
  buttons?: string[];
}

export interface BotResult {
  state: BotState;
  replies: BotReply[];
  /** Ação que o app precisa executar depois de responder. */
  action?: "create_order" | "human";
}

export function initialBotState(): BotState {
  return {
    step: "start",
    items: [],
    address: {
      street: "",
      number: "",
      neighborhood: "",
      complement: "",
      reference: "",
      receiver: "",
    },
    payment: null,
    cashFor: null,
  };
}

const normalize = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export function subtotalOf(state: BotState): number {
  return sum(state.items);
}

export function totalOf(state: BotState): number {
  return Math.round((subtotalOf(state) + DELIVERY_FEE) * 100) / 100;
}

const PAYMENT_BUTTONS = ["Pix", "Cartão na entrega", "Dinheiro"];

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  pix: "Pix",
  card: "Cartão na entrega",
  cash: "Dinheiro",
};

function itemsText(state: BotState): string {
  const lines = state.items.map(
    (item) => `• ${qtyLabel(item.qty, item.unit)} ${item.name} — ${brl(item.total)}`,
  );
  return [
    "Anotei assim:",
    ...lines,
    "",
    `Subtotal: ${brl(subtotalOf(state))}`,
    `Taxa de entrega: ${brl(DELIVERY_FEE)}`,
    `Total: ${brl(totalOf(state))}`,
  ].join("\n");
}

export function summaryText(state: BotState, orderNumber?: string): string {
  const lines = state.items.map(
    (item) => `• ${qtyLabel(item.qty, item.unit)} ${item.name} — ${brl(item.total)}`,
  );
  const payment = state.payment ? PAYMENT_LABEL[state.payment] : "-";
  const troco =
    state.payment === "cash" && state.cashFor
      ? `\nTroco para ${brl(state.cashFor)}: ${brl(Math.round((state.cashFor - totalOf(state)) * 100) / 100)}`
      : "";
  return [
    orderNumber ? `*Pedido ${orderNumber} confirmado!*` : "*Confira seu pedido*",
    ...lines,
    "",
    `Subtotal: ${brl(subtotalOf(state))}`,
    `Entrega: ${brl(DELIVERY_FEE)}`,
    `*Total: ${brl(totalOf(state))}*`,
    `Pagamento: ${payment}${troco}`,
    "",
    `Entrega para ${state.address.receiver}`,
    `${state.address.street}, ${state.address.number} — ${state.address.neighborhood}`,
    state.address.reference ? `Referência: ${state.address.reference}` : "",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function alternatives(products: Product[], missing: string[]): string {
  const soldOut = products.filter((p) => missing.includes(p.name));
  const suggestions = soldOut
    .map((product) => {
      const other = products.find(
        (p) => p.available && p.category === product.category && p.id !== product.id,
      );
      return other ? `Em vez de ${product.name}, temos ${other.name} (${brl(other.price)}).` : null;
    })
    .filter((line): line is string => line != null);
  return suggestions.join("\n");
}

/** Motor da conversa: recebe o texto (ou clique de botão) do cliente e devolve as respostas. */
export function advance(state: BotState, input: string, products: Product[]): BotResult {
  const text = input.trim();
  const n = normalize(text);
  const keep = (replies: BotReply[], step: BotStep = state.step): BotResult => ({
    state: { ...state, step },
    replies,
  });

  if (n.includes("reiniciar") || n === "cancelar") {
    return {
      state: initialBotState(),
      replies: [{ text: WELCOME_TEXT, buttons: WELCOME_BUTTONS }],
    };
  }

  switch (state.step) {
    case "human":
      return keep([
        { text: "Já avisamos a dona da loja, ela responde por aqui em instantes. 🙏" },
      ]);

    case "start":
    case "done": {
      if (n.includes("atendente") || n.includes("humano")) {
        return {
          state: { ...initialBotState(), step: "human" },
          replies: [
            {
              text: "Tudo bem! Já chamei a dona da loja aqui no balcão. Ela vai te responder em instantes. 😊",
            },
          ],
          action: "human",
        };
      }
      if (n.includes("pedido") || n.includes("comprar") || n.includes("sim")) {
        return {
          state: { ...initialBotState(), step: "items" },
          replies: [
            {
              text: "Que bom! 😀 Me manda sua lista de compras em uma mensagem só.\nEx.: 1kg de tomate, 2 pés de alface, 1 óleo Liza e 500g de cebola",
            },
          ],
        };
      }
      return keep([{ text: WELCOME_TEXT, buttons: WELCOME_BUTTONS }], "start");
    }

    case "items": {
      const { items, unknown, unavailable } = parseOrderText(text, products);
      if (items.length === 0) {
        const soldOutMsg = unavailable.length
          ? `Infelizmente ${unavailable.join(", ")} está esgotado hoje.\n${alternatives(products, unavailable)}`
          : "";
        return keep([
          {
            text:
              (soldOutMsg ? soldOutMsg + "\n\n" : "") +
              "Não consegui entender os itens. Pode escrever de novo com a quantidade e o produto? Ex.: 2kg de banana, 1 leite",
          },
        ]);
      }
      const merged = { ...state, items };
      const replies: BotReply[] = [];
      if (unavailable.length) {
        replies.push({
          text: `Só um aviso: ${unavailable.join(", ")} está esgotado hoje.\n${alternatives(products, unavailable)}`,
        });
      }
      if (unknown.length) {
        replies.push({
          text: `Não encontrei no nosso catálogo: ${unknown.join(", ")}. Se quiser, escreva de outra forma depois.`,
        });
      }
      replies.push({
        text: itemsText(merged),
        buttons: ["Está certo", "Corrigir a lista"],
      });
      return { state: { ...merged, step: "items_confirm" }, replies };
    }

    case "items_confirm": {
      if (n.includes("corrigir") || n.includes("nao")) {
        return {
          state: { ...state, items: [], step: "items" },
          replies: [{ text: "Sem problema! Me manda a lista novamente, por favor." }],
        };
      }
      if (n.includes("certo") || n.includes("sim") || n.includes("ok")) {
        return {
          state: { ...state, step: "name" },
          replies: [{ text: "Perfeito! Qual é o seu nome (quem vai receber o pedido)?" }],
        };
      }
      const extra = parseOrderText(text, products);
      if (extra.items.length) {
        const items = [...state.items];
        for (const item of extra.items) {
          const existing = items.find((i) => i.name === item.name);
          if (existing) {
            existing.qty = Math.round((existing.qty + item.qty) * 1000) / 1000;
            existing.total = Math.round(existing.qty * existing.unitPrice * 100) / 100;
          } else items.push(item);
        }
        const merged = { ...state, items };
        return {
          state: merged,
          replies: [{ text: itemsText(merged), buttons: ["Está certo", "Corrigir a lista"] }],
        };
      }
      return keep([
        { text: "Pode confirmar a lista?", buttons: ["Está certo", "Corrigir a lista"] },
      ]);
    }

    case "name":
      if (text.length < 2) return keep([{ text: "Como é o seu nome, por favor?" }]);
      return {
        state: { ...state, address: { ...state.address, receiver: text }, step: "street" },
        replies: [{ text: `Obrigada, ${text}! Qual é a rua da entrega?` }],
      };

    case "street":
      if (text.length < 3) return keep([{ text: "Qual é o nome da rua?" }]);
      return {
        state: { ...state, address: { ...state.address, street: text }, step: "number" },
        replies: [{ text: "E o número da casa ou apartamento?" }],
      };

    case "number":
      if (text.length < 1) return keep([{ text: "Qual é o número?" }]);
      return {
        state: { ...state, address: { ...state.address, number: text }, step: "neighborhood" },
        replies: [{ text: "Qual é o bairro?" }],
      };

    case "neighborhood":
      if (text.length < 2) return keep([{ text: "Qual é o bairro?" }]);
      return {
        state: { ...state, address: { ...state.address, neighborhood: text }, step: "reference" },
        replies: [
          { text: "Tem algum ponto de referência para o entregador achar mais fácil?" },
        ],
      };

    case "reference":
      return {
        state: {
          ...state,
          address: { ...state.address, reference: n === "nao" ? "" : text },
          step: "payment",
        },
        replies: [
          {
            text: `Fechando: total de ${brl(totalOf(state))} (já com a entrega de ${brl(DELIVERY_FEE)}).\nComo você prefere pagar?`,
            buttons: PAYMENT_BUTTONS,
          },
        ],
      };

    case "payment": {
      if (n.includes("pix")) {
        const next = { ...state, payment: "pix" as PaymentMethod, step: "confirm" as BotStep };
        return {
          state: next,
          replies: [
            { text: summaryText(next), buttons: ["Confirmar pedido", "Cancelar"] },
          ],
        };
      }
      if (n.includes("cartao") || n.includes("credito") || n.includes("debito")) {
        const next = { ...state, payment: "card" as PaymentMethod, step: "confirm" as BotStep };
        return {
          state: next,
          replies: [
            { text: "Combinado, o entregador leva a maquininha. 💳" },
            { text: summaryText(next), buttons: ["Confirmar pedido", "Cancelar"] },
          ],
        };
      }
      if (n.includes("dinheiro") || n.includes("especie")) {
        return {
          state: { ...state, payment: "cash", step: "cash" },
          replies: [{ text: "Precisa de troco para quanto?" }],
        };
      }
      return keep([{ text: "Como você prefere pagar?", buttons: PAYMENT_BUTTONS }]);
    }

    case "cash": {
      const match = text.replace(/[^\d,.]/g, "").replace(",", ".");
      const value = parseFloat(match);
      const total = totalOf(state);
      if (!value || Number.isNaN(value)) {
        return keep([
          { text: `Me diga o valor da nota, por exemplo 50. Seu total é ${brl(total)}.` },
        ]);
      }
      if (value < total) {
        return keep([
          {
            text: `O total do pedido é ${brl(total)}. Com ${brl(value)} não dá. Vai pagar com quanto?`,
          },
        ]);
      }
      const next = { ...state, cashFor: value, step: "confirm" as BotStep };
      return {
        state: next,
        replies: [
          {
            text: `Anotado! Troco de ${brl(Math.round((value - total) * 100) / 100)} para a nota de ${brl(value)}.`,
          },
          { text: summaryText(next), buttons: ["Confirmar pedido", "Cancelar"] },
        ],
      };
    }

    case "confirm": {
      if (n.includes("confirmar") || n.includes("sim")) {
        return { state: { ...state, step: "done" }, replies: [], action: "create_order" };
      }
      return keep([
        { text: "Posso confirmar o pedido?", buttons: ["Confirmar pedido", "Cancelar"] },
      ]);
    }

    default:
      return keep([{ text: WELCOME_TEXT, buttons: WELCOME_BUTTONS }], "start");
  }
}
