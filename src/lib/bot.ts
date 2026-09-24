import { cleanUnknownName, extractRemoval, normalize, parseOrderText, sum } from "./parser";
import { brl, qtyLabel } from "./format";
import { PIX_KEY } from "./catalog";
import type { Address, OrderItem, PaymentMethod, Product } from "./types";
export { createOrderFromBot } from "./data";

/** Taxa de entrega padrÃ£o da loja (R$ 5,00 fixa). */
export const DELIVERY_FEE = 5;

export const WELCOME_TEXT =
  "Oi! ðŸ˜Š Aqui Ã© o CebolÃ£o EmpÃ³rio e VerdurÃ£o â€” hortifruti fresquinho e mercearia com entrega no Setor Oeste e regiÃ£o. Como posso te ajudar hoje?";

export const WELCOME_BUTTONS = ["Fazer pedido", "Falar com atendente"];

export type BotStep =
  | "start"
  | "items"
  | "unknown_item_prompt"
  | "review"
  | "address"
  | "receiver_name"
  | "payment"
  | "cash_change"
  | "confirm_final"
  | "done"
  | "human";

export interface BotState {
  step: BotStep;
  items: OrderItem[];
  unknownItems?: string[];
  address: Address;
  payment: PaymentMethod | null;
  cashFor: number | null;
  change: number | null;
}

export interface BotReply {
  text: string;
  buttons?: string[];
}

export interface BotResult {
  state: BotState;
  replies: BotReply[];
  /** AÃ§Ã£o que o app ou webhook precisa executar. */
  action?: "create_order" | "human";
}

export function initialBotState(): BotState {
  return {
    step: "start",
    items: [],
    unknownItems: [],
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
    change: null,
  };
}

export function subtotalOf(state: BotState): number {
  return sum(state.items);
}

export function totalOf(state: BotState): number {
  return Math.round((subtotalOf(state) + DELIVERY_FEE) * 100) / 100;
}

const PAYMENT_BUTTONS = ["Pix", "CartÃ£o na entrega", "Dinheiro"];

export function itemsListText(state: BotState): string {
  const lines = state.items.map(
    (item, index) => `${index + 1}. ${qtyLabel(item.qty, item.unit)} ${item.name} â€” ${brl(item.total)}`,
  );
  return [
    "*Itens identificados:*",
    ...lines,
    "",
    `Subtotal: ${brl(subtotalOf(state))}`,
    `Taxa de entrega: ${brl(DELIVERY_FEE)}`,
    `*Total parcial: ${brl(totalOf(state))}*`,
  ].join("\n");
}

export function summaryText(state: BotState, orderNumber?: string): string {
  const lines = state.items.map(
    (item) => `â€¢ ${qtyLabel(item.qty, item.unit)} ${item.name} â€” ${brl(item.total)}`,
  );
  const payment =
    state.payment === "pix"
      ? "Pix"
      : state.payment === "card"
        ? "CartÃ£o na entrega (motoboy leva maquininha)"
        : "Dinheiro";

  const trocoText =
    state.payment === "cash" && state.cashFor && state.cashFor > totalOf(state)
      ? `\n  ðŸ’µ Troco de ${brl(state.change ?? Math.round((state.cashFor - totalOf(state)) * 100) / 100)} para ${brl(state.cashFor)}`
      : state.payment === "cash"
        ? "\n  ðŸ’µ Pagamento exato (sem troco)"
        : "";

  return [
    orderNumber ? `ðŸŽ‰ *Pedido ${orderNumber} confirmado com sucesso!*` : "ðŸ“‹ *Resumo do Pedido*",
    "",
    ...lines,
    "",
    `Subtotal: ${brl(subtotalOf(state))}`,
    `Taxa de entrega: ${brl(DELIVERY_FEE)}`,
    `*Total: ${brl(totalOf(state))}*`,
    `Forma de pagamento: ${payment}${trocoText}`,
    "",
    `ðŸ“ *EndereÃ§o:* ${state.address.street}`,
    `ðŸ‘¤ *Recebe:* ${state.address.receiver}`,
  ].join("\n");
}

function alternatives(products: Product[], missing: string[]): string {
  const soldOut = products.filter((p) => missing.includes(p.name));
  const suggestions = soldOut
    .map((product) => {
      const other = products.find(
        (p) => p.available && p.category === product.category && p.id !== product.id,
      );
      return other
        ? `â€¢ Em vez de ${product.name}, temos ${other.name} (${brl(other.price)}/${other.unit}).`
        : null;
    })
    .filter((line): line is string => line != null);

  return suggestions.length
    ? `SugestÃµes disponÃ­veis hoje:\n${suggestions.join("\n")}`
    : "No momento nÃ£o temos substitutos diretos nessa categoria.";
}

/** Motor da conversa: processa texto ou clique de botÃ£o e devolve as respostas do bot */
export function advance(state: BotState, input: string, products: Product[]): BotResult {
  const text = input.trim();
  const n = normalize(text);

  const keep = (replies: BotReply[], step: BotStep = state.step): BotResult => ({
    state: { ...state, step },
    replies,
  });

  // Comando de reinÃ­cio / voltar ao menu principal (universal)
  if (
    n === "reiniciar" ||
    n === "voltar" ||
    n === "voltar ao menu" ||
    n === "menu principal" ||
    n === "reiniciar conversa" ||
    n === "novo teste" ||
    n === "comecar de novo" ||
    n === "cancelar pedido"
  ) {
    return {
      state: initialBotState(),
      replies: [{ text: WELCOME_TEXT, buttons: WELCOME_BUTTONS }],
    };
  }

  switch (state.step) {
    case "human": {
      if (n === "voltar" || n === "reiniciar" || n === "menu") {
        return {
          state: initialBotState(),
          replies: [{ text: "Voltamos ao início! Como posso te ajudar hoje?", buttons: WELCOME_BUTTONS }],
        };
      }
      return {
        state,
        replies: [
          { text: "Sua mensagem foi recebida e será respondida em breve. ?? Se quiser voltar ao menu principal, digite 'voltar'." },
        ],
        action: "human",
      };
    }

    case "start":
    case "done": {
      // 1. Cliente escolhe falar com atendente humano
      if (
        n.includes("atendente") ||
        n.includes("humano") ||
        n.includes("falar com") ||
        n.includes("dona")
      ) {
        return {
          state: { ...initialBotState(), step: "human" },
          replies: [
            {
              text: "Tudo bem! O responsÃ¡vel irÃ¡ atendÃª-lo em instantes. ðŸ˜Š",
            },
          ],
          action: "human",
        };
      }

      // 2. Cliente escolhe fazer pedido
      if (
        n.includes("pedido") ||
        n.includes("comprar") ||
        n.includes("fazer pedido") ||
        n.includes("quero comprar") ||
        n.includes("sim") ||
        n.includes("oi") ||
        n.includes("ola")
      ) {
        return {
          state: { ...initialBotState(), step: "items" },
          replies: [
            {
              text: "Que Ã³timo! ðŸ˜€ Me mande a sua lista de compras em uma mensagem sÃ³.\n\nPor exemplo: *1kg de tomate, 500g de cebola, 2 pÃ©s de alface e 1 Ã³leo Liza*",
            },
          ],
        };
      }

      return keep([{ text: WELCOME_TEXT, buttons: WELCOME_BUTTONS }], "start");
    }

    case "items": {
      const { items, unknown, unavailable } = parseOrderText(text, products);

      // CenÃ¡rio 1: Nenhum item foi reconhecido e temos itens desconhecidos
      if (items.length === 0 && unknown.length > 0) {
        const missingName = unknown[0];
        return keep([
          {
            text: `NÃ£o temos '${missingName}' no momento ðŸ˜•.\n\nQuer tentar outro produto do nosso catÃ¡logo? Me envie o que deseja comprar:`,
          },
        ]);
      }

      // CenÃ¡rio 2: Nada reconhecido e nenhuma palavra de produto
      if (items.length === 0) {
        const soldOutMsg = unavailable.length
          ? `Infelizmente ${unavailable.join(", ")} estÃ¡ esgotado hoje.\n${alternatives(products, unavailable)}\n\n`
          : "";
        return keep([
          {
            text: `${soldOutMsg}NÃ£o consegui identificar os produtos na mensagem. Pode escrever a quantidade e o produto?\nExemplo: *2kg de batata, 1 leite e 500g de cebola*`,
          },
        ]);
      }

      const mergedState = { ...state, items };
      const replies: BotReply[] = [];

      // Avisa sobre produtos esgotados
      if (unavailable.length > 0) {
        replies.push({
          text: `âš ï¸ *Aviso de estoque:* Infelizmente ${unavailable.join(", ")} estÃ¡ esgotado hoje.\n${alternatives(products, unavailable)}`,
        });
      }

      // Se houver algum item nÃ£o cadastrado junto com itens vÃ¡lidos:
      if (unknown.length > 0) {
        const missingName = unknown[0];
        replies.push({
          text: `NÃ£o temos '${missingName}' no momento ðŸ˜•. Quer continuar o pedido sem esse item ou gostaria de adicionar outro no lugar?`,
          buttons: [`Continuar sem ${missingName}`, "Adicionar outro item"],
        });
        return {
          state: {
            ...mergedState,
            unknownItems: unknown,
            step: "unknown_item_prompt",
          },
          replies,
        };
      }

      // Todos os itens reconhecidos: vai para a revisÃ£o
      replies.push({
        text: `${itemsListText(mergedState)}\n\nConfere? Quer adicionar, remover ou corrigir algum item?`,
        buttons: ["EstÃ¡ certo! Prosseguir", "Adicionar mais itens", "Corrigir lista"],
      });

      return {
        state: { ...mergedState, step: "review" },
        replies,
      };
    }

    case "unknown_item_prompt": {
      // Cliente quer continuar sem o item
      if (
        n.includes("continuar sem") ||
        n.includes("continuar") ||
        n.includes("seguir") ||
        n.includes("sem ele") ||
        n.includes("sem esse") ||
        n.includes("pode ser sem")
      ) {
        return {
          state: { ...state, step: "review", unknownItems: [] },
          replies: [
            {
              text: `Combinado! Seguindo sem o item.\n\n${itemsListText(state)}\n\nConfere? Quer adicionar, remover ou corrigir algum item?`,
              buttons: ["EstÃ¡ certo! Prosseguir", "Adicionar mais itens", "Corrigir lista"],
            },
          ],
        };
      }

      // Cliente quer adicionar outro item no lugar
      if (n.includes("adicionar outro") || n.includes("outro") || n.includes("substituir")) {
        return keep([
          {
            text: "Pode me dizer qual produto vocÃª gostaria de colocar no lugar (ex: 'coloca 1kg de batata'):",
          },
        ]);
      }

      // Cliente digitou diretamente o novo item
      const extra = parseOrderText(text, products);
      if (extra.items.length > 0) {
        const items = [...state.items];
        for (const item of extra.items) {
          const existing = items.find((i) => i.productId === item.productId);
          if (existing) {
            existing.qty = Math.round((existing.qty + item.qty) * 1000) / 1000;
            existing.total = Math.round(existing.qty * existing.unitPrice * 100) / 100;
          } else {
            items.push(item);
          }
        }
        const updatedState = { ...state, items, unknownItems: [], step: "review" as BotStep };
        return {
          state: updatedState,
          replies: [
            {
              text: `Adicionei Ã  lista! Veja como ficou:\n\n${itemsListText(updatedState)}\n\nConfere? Quer adicionar, remover ou corrigir algum item?`,
              buttons: ["EstÃ¡ certo! Prosseguir", "Adicionar mais itens", "Corrigir lista"],
            },
          ],
        };
      }

      return keep([
        {
          text: "Quer continuar o pedido sem o produto que nÃ£o temos ou gostaria de adicionar outro?",
          buttons: ["Continuar sem esse item", "Adicionar outro item"],
        },
      ]);
    }

    case "review": {
      // 1. ConfirmaÃ§Ã£o positiva: segue para coleta de endereÃ§o
      if (
        n === "esta certo! prosseguir" ||
        n === "esta certo" ||
        n === "prosseguir" ||
        n === "sim" ||
        n === "confere" ||
        n === "tudo certo" ||
        n === "pode prosseguir" ||
        n === "ok" ||
        n === "fechar" ||
        n === "continuar"
      ) {
        return {
          state: { ...state, step: "address" },
          replies: [
            {
              text: "Perfeito! Agora vamos para o endereÃ§o de entrega.\n\nPor favor, digite o endereÃ§o de entrega em uma sÃ³ linha (rua, nÃºmero, bairro, complemento e ponto de referÃªncia, se tiver).",
            },
          ],
        };
      }

      // 2. RemoÃ§Ã£o de item solicitada pelo cliente
      const removal = extractRemoval(text, state.items);
      if (removal.removed) {
        const remaining = removal.remaining;
        if (remaining.length === 0) {
          return {
            state: { ...state, items: [], step: "items" },
            replies: [
              {
                text: `Removi ${removal.removed.name}. Sua lista agora estÃ¡ vazia. Pode me enviar uma nova lista de itens:`,
              },
            ],
          };
        }
        const updatedState = { ...state, items: remaining };
        return {
          state: updatedState,
          replies: [
            {
              text: `Removi *${removal.removed.name}* da lista! âœ…\n\n${itemsListText(updatedState)}\n\nConfere? Quer adicionar, remover ou corrigir algum item?`,
              buttons: ["EstÃ¡ certo! Prosseguir", "Adicionar mais itens", "Corrigir lista"],
            },
          ],
        };
      }

      // 3. AdiÃ§Ã£o ou acrÃ©scimo de mais produtos
      const additions = parseOrderText(text, products);
      if (additions.items.length > 0) {
        const items = [...state.items];
        for (const item of additions.items) {
          const existing = items.find((i) => i.productId === item.productId);
          if (existing) {
            existing.qty = Math.round((existing.qty + item.qty) * 1000) / 1000;
            existing.total = Math.round(existing.qty * existing.unitPrice * 100) / 100;
          } else {
            items.push(item);
          }
        }
        const updatedState = { ...state, items };
        const extraReplies: BotReply[] = [];
        if (additions.unknown.length > 0) {
          extraReplies.push({
            text: `Aviso: nÃ£o temos '${additions.unknown[0]}' no momento ðŸ˜•.`,
          });
        }
        extraReplies.push({
          text: `Atualizei seu pedido! ðŸ›’\n\n${itemsListText(updatedState)}\n\nConfere? Quer adicionar, remover ou corrigir algum item?`,
          buttons: ["EstÃ¡ certo! Prosseguir", "Adicionar mais itens", "Corrigir lista"],
        });
        return {
          state: updatedState,
          replies: extraReplies,
        };
      }

      if (n.includes("adicionar mais") || n.includes("adicionar")) {
        return keep([
          {
            text: "Pode escrever o que deseja adicionar (ex: '1kg de batata e 1 Ã³leo Liza'):",
          },
        ]);
      }

      if (n.includes("corrigir") || n.includes("mudar")) {
        return keep([
          {
            text: "O que vocÃª deseja mudar? VocÃª pode me dizer para remover (ex: 'tirar tomate'), adicionar (ex: 'mais 1kg de cebola') ou mandar a lista completa novamente.",
          },
        ]);
      }

      return keep([
        {
          text: "Podemos prosseguir com esse pedido ou gostaria de ajustar algum item?",
          buttons: ["EstÃ¡ certo! Prosseguir", "Adicionar mais itens", "Corrigir lista"],
        },
      ]);
    }

    case "address": {
      if (text.length < 5) {
        return keep([
          {
            text: "Por favor, digite o endereÃ§o completo em uma linha sÃ³ (rua, nÃºmero, bairro, complemento e ponto de referÃªncia, se tiver).",
          },
        ]);
      }

      // Aceita o texto corrido como estÃ¡
      const nextState: BotState = {
        ...state,
        address: {
          ...state.address,
          street: text,
        },
        step: "receiver_name",
      };

      return {
        state: nextState,
        replies: [
          {
            text: "Anotado! ðŸ“\n\nE quem vai receber o pedido? Por favor, digite o seu nome.",
          },
        ],
      };
    }

    case "receiver_name": {
      if (text.length < 2) {
        return keep([
          {
            text: "Como Ã© o nome de quem vai receber, por favor?",
          },
        ]);
      }

      const nextState: BotState = {
        ...state,
        address: {
          ...state.address,
          receiver: text,
        },
        step: "payment",
      };

      return {
        state: nextState,
        replies: [
          {
            text: `Muito obrigado, ${text}! ðŸ˜Š\n\nSubtotal dos itens: ${brl(subtotalOf(state))}\nTaxa de entrega fixa: ${brl(DELIVERY_FEE)}\n*Total a pagar: ${brl(totalOf(state))}*\n\nComo vocÃª prefere fazer o pagamento?`,
            buttons: PAYMENT_BUTTONS,
          },
        ],
      };
    }

    case "payment": {
      // 1. Pix
      if (n.includes("pix")) {
        const nextState: BotState = {
          ...state,
          payment: "pix",
          cashFor: null,
          change: null,
          step: "confirm_final",
        };
        return {
          state: nextState,
          replies: [
            {
              text: `Chave Pix do CebolÃ£o (Copia e Cola):\n\`${PIX_KEY}\`\n\nVocÃª pode efetuar a transferÃªncia e nos enviar o comprovante apÃ³s a confirmaÃ§Ã£o.`,
            },
            {
              text: summaryText(nextState),
              buttons: ["Confirmar pedido", "Voltar / Corrigir"],
            },
          ],
        };
      }

      // 2. CartÃ£o na Entrega
      if (n.includes("cartao") || n.includes("credito") || n.includes("debito") || n.includes("maquininha")) {
        const nextState: BotState = {
          ...state,
          payment: "card",
          cashFor: null,
          change: null,
          step: "confirm_final",
        };
        return {
          state: nextState,
          replies: [
            {
              text: "Combinado! Vamos avisar o motoboy para levar a maquininha ðŸ’³",
            },
            {
              text: summaryText(nextState),
              buttons: ["Confirmar pedido", "Voltar / Corrigir"],
            },
          ],
        };
      }

      // 3. Dinheiro
      if (n.includes("dinheiro") || n.includes("especie") || n.includes("nota")) {
        return {
          state: { ...state, payment: "cash", step: "cash_change" },
          replies: [
            {
              text: `O total da compra Ã© ${brl(totalOf(state))}.\n\nPrecisa de troco para quanto? (Se tiver o valor exato, pode responder 'nÃ£o precisa')`,
            },
          ],
        };
      }

      return keep([
        {
          text: "Como vocÃª prefere fazer o pagamento?",
          buttons: PAYMENT_BUTTONS,
        },
      ]);
    }

    case "cash_change": {
      const total = totalOf(state);

      // NÃ£o precisa de troco
      if (
        n.includes("nao precisa") ||
        n.includes("sem troco") ||
        n.includes("exato") ||
        n === "nao"
      ) {
        const nextState: BotState = {
          ...state,
          cashFor: total,
          change: 0,
          step: "confirm_final",
        };
        return {
          state: nextState,
          replies: [
            {
              text: "Combinado! Pagamento em dinheiro no valor exato. ðŸ’µ",
            },
            {
              text: summaryText(nextState),
              buttons: ["Confirmar pedido", "Voltar / Corrigir"],
            },
          ],
        };
      }

      const match = text.replace(/[^\d,.]/g, "").replace(",", ".");
      const val = parseFloat(match);

      if (!val || Number.isNaN(val)) {
        return keep([
          {
            text: `Precisa de troco para quanto? Digite o valor da nota que vai pagar (ex: 50 ou 100), ou diga 'nÃ£o precisa'. Seu total Ã© ${brl(total)}.`,
          },
        ]);
      }

      if (val < total) {
        return keep([
          {
            text: `O total do pedido Ã© ${brl(total)}. A nota de ${brl(val)} nÃ£o cobre o valor. Precisa de troco para quanto?`,
          },
        ]);
      }

      const trocoCalculado = Math.round((val - total) * 100) / 100;
      const nextState: BotState = {
        ...state,
        cashFor: val,
        change: trocoCalculado,
        step: "confirm_final",
      };

      return {
        state: nextState,
        replies: [
          {
            text: `Anotado! Troco de ${brl(trocoCalculado)} para a nota de ${brl(val)}. ðŸ’µ`,
          },
          {
            text: summaryText(nextState),
            buttons: ["Confirmar pedido", "Voltar / Corrigir"],
          },
        ],
      };
    }

    case "confirm_final": {
      if (
        n.includes("confirmar") ||
        n.includes("confirmar pedido") ||
        n === "sim" ||
        n === "pode mandar" ||
        n === "ok"
      ) {
        return {
          state: { ...state, step: "done" },
          replies: [],
          action: "create_order",
        };
      }

      if (n.includes("voltar") || n.includes("corrigir") || n.includes("cancelar")) {
        return {
          state: { ...state, step: "review" },
          replies: [
            {
              text: `Voltamos para a revisÃ£o dos itens:\n\n${itemsListText(state)}\n\nO que gostaria de adicionar, remover ou corrigir?`,
              buttons: ["EstÃ¡ certo! Prosseguir", "Adicionar mais itens", "Corrigir lista"],
            },
          ],
        };
      }

      return keep([
        {
          text: "Podemos enviar esse pedido para a loja?",
          buttons: ["Confirmar pedido", "Voltar / Corrigir"],
        },
      ]);
    }

    default:
      return keep([{ text: WELCOME_TEXT, buttons: WELCOME_BUTTONS }], "start");
  }
}
