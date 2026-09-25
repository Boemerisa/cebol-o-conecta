import { cleanUnknownName, extractRemoval, normalize, parseOrderText, sum } from "./parser";
import { brl, qtyLabel } from "./format";
import { PIX_KEY } from "./catalog";
import type { Address, OrderItem, PaymentMethod, Product } from "./types";
export { createOrderFromBot } from "./data";

/** Taxa de entrega padrão da loja (R$ 5,00 fixa). */
export const DELIVERY_FEE = 5;

export const WELCOME_TEXT = "Oi! 😊 Aqui é o Cebolão Empório e Verdurão — hortifruti fresquinho e mercearia com entrega no Setor Oeste e região. Como posso te ajudar hoje?";

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
  /** Ação que o app ou webhook precisa executar. */
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

const PAYMENT_BUTTONS = ["Pix", "Cartão na entrega", "Dinheiro"];

export function itemsListText(state: BotState): string {
  const lines = state.items.map(
    (item, index) => `${index + 1}. ${qtyLabel(item.qty, item.unit)} ${item.name} — ${brl(item.total)}`,
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


export function isStoreOpen(date: Date = new Date()): boolean {
  // Ajuste para horário de Brasília (UTC-3)
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const brDate = new Date(utc - 3 * 3600000);
  const day = brDate.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  const minutes = brDate.getHours() * 60 + brDate.getMinutes();

  const openTime = 7 * 60 + 30; // 07:30 (450 min)

  if (day >= 1 && day <= 5) {
    // Seg a Sex: 07:30 às 19:00 (1140 min)
    return minutes >= openTime && minutes < 19 * 60;
  } else if (day === 6) {
    // Sábado: 07:30 às 16:00 (960 min)
    return minutes >= openTime && minutes < 16 * 60;
  } else if (day === 0) {
    // Domingo: 07:30 às 12:00 (720 min)
    return minutes >= openTime && minutes < 12 * 60;
  }
  return false;
}

export const CLOSED_STORE_MESSAGE =
  "Desculpe, estamos fechados no momento! Horário de atendimento: seg a sex — 07:30 às 19h, sáb — 07:30 às 16h, e dom — 07:30 às 12h";

export function summaryText(state: BotState, orderNumber?: string): string {
  const lines = state.items.map(
    (item) => `• ${qtyLabel(item.qty, item.unit)} ${item.name} — ${brl(item.total)}`,
  );
  const payment =
    state.payment === "pix"
      ? "Pix"
      : state.payment === "card"
        ? "Cartão na entrega (motoboy leva maquininha)"
        : "Dinheiro";

  const trocoText =
    state.payment === "cash" && state.cashFor && state.cashFor > totalOf(state)
      ? `\r\n  💵 Troco de ${brl(state.change ?? Math.round((state.cashFor - totalOf(state)) * 100) / 100)} para ${brl(state.cashFor)}`
      : state.payment === "cash"
        ? "\r\n  💵 Pagamento exato (sem troco)"
        : "";

  return [
    orderNumber ? `🎉 *Pedido #${orderNumber} confirmado com sucesso!*` : "📋 *Resumo do Pedido*",
    "",
    ...lines,
    "",
    `Subtotal: ${brl(subtotalOf(state))}`,
    `Taxa de entrega: ${brl(DELIVERY_FEE)}`,
    `*Total: ${brl(totalOf(state))}*`,
    `Forma de pagamento: ${payment}${trocoText}`,
    "",
    `📍 *Endereço:* ${state.address.street}`,
    `👤 *Recebe:* ${state.address.receiver}`,
    `📅 *Data e Hora:* ${new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date()).replace(", ", " às ")}`,
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
        ? `• Em vez de ${product.name}, temos ${other.name} (${brl(other.price)}/${other.unit}).`
        : null;
    })
    .filter((line): line is string => line != null);

  return suggestions.length
    ? `Sugestões disponíveis hoje:\n${suggestions.join("\n")}`
    : "No momento não temos substitutos diretos nessa categoria.";
}

/** Motor da conversa: processa texto ou clique de botão e devolve as respostas do bot */
export function advance(state: BotState, input: string, products: Product[]): BotResult {
  const text = input.trim();
  const n = normalize(text);

  const keep = (replies: BotReply[], step: BotStep = state.step): BotResult => ({
    state: { ...state, step },
    replies,
  });

  // Comandos universais de navegação (funcionam em qualquer momento)
  if (
    n === "reiniciar" ||
    n === "voltar" ||
    n === "voltar ao menu" ||
    n === "voltar ao inicio" ||
    n === "voltar ao início" ||
    n === "inicio" ||
    n === "início" ||
    n === "menu" ||
    n === "menu principal" ||
    n === "reiniciar conversa" ||
    n === "novo teste" ||
    n === "comecar de novo" ||
    n === "cancelar pedido"
  ) {
    return {
      state: initialBotState(),
      replies: [{ text: "Voltamos ao início! Como posso te ajudar hoje? 😊", buttons: WELCOME_BUTTONS }],
    };
  }

  // Se clicar ou digitar "Falar com atendente" em qualquer etapa
  if (
    n === "falar com atendente" ||
    n === "atendente" ||
    n === "falar com humano" ||
    n === "atendente humano"
  ) {
    return {
      state: { ...initialBotState(), step: "human" },
      replies: [
        {
          text: "Tudo bem! O responsável irá atendê-lo em instantes. Deixe aqui a sua mensagem 😊",
        },
      ],
      action: "human",
    };
  }

  // Se clicar ou digitar "Fazer pedido" em qualquer etapa
  if (
    n === "fazer um pedido" ||
    n === "fazer pedido" ||
    n === "quero fazer um pedido" ||
    n === "novo pedido"
  ) {
    return {
      state: { ...initialBotState(), step: "items" },
      replies: [
        {
          text: "Que ótimo! 😀 Me mande a sua lista de compras em uma mensagem só.\n\nPor exemplo: *1kg de tomate, 500g de cebola, 2 pés de alface e 1 óleo Liza*",
        },
      ],
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
          { text: "Sua mensagem foi recebida e será respondida em breve. 😊 Se quiser voltar ao menu principal, digite 'voltar'." },
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
              text: "Tudo bem! O responsável irá atendê-lo em instantes. Deixe aqui a sua mensagem 😊",
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
              text: "Que ótimo! 😀 Me mande a sua lista de compras em uma mensagem só.\n\nPor exemplo: *1kg de tomate, 500g de cebola, 2 pés de alface e 1 óleo Liza*",
            },
          ],
        };
      }

      return keep([{ text: WELCOME_TEXT, buttons: WELCOME_BUTTONS }], "start");
    }

    case "items": {
      const { items, unknown, unavailable } = parseOrderText(text, products);

      // Cenário 1: Nenhum item foi reconhecido e temos itens desconhecidos
      if (items.length === 0 && unknown.length > 0) {
        const missingName = unknown[0];
        return keep([
          {
            text: `Não temos '${missingName}' no momento 😕.\n\nQuer tentar outro produto do nosso catálogo? Me envie o que deseja comprar:`,
          },
        ]);
      }

      // Cenário 2: Nada reconhecido e nenhuma palavra de produto
      if (items.length === 0) {
        const soldOutMsg = unavailable.length
          ? `Infelizmente ${unavailable.join(", ")} está esgotado hoje.\n${alternatives(products, unavailable)}\n\n`
          : "";
        return keep([
          {
            text: `${soldOutMsg}Não consegui identificar os produtos na mensagem. Pode escrever a quantidade e o produto?\nExemplo: *2kg de batata, 1 leite e 500g de cebola*`,
          },
        ]);
      }

      const mergedState = { ...state, items };
      const replies: BotReply[] = [];

      // Avisa sobre produtos esgotados
      if (unavailable.length > 0) {
        replies.push({
          text: `⚠️ *Aviso de estoque:* Infelizmente ${unavailable.join(", ")} está esgotado hoje.\n${alternatives(products, unavailable)}`,
        });
      }

      // Se houver algum item não cadastrado junto com itens válidos:
      if (unknown.length > 0) {
        const missingName = unknown[0];
        replies.push({
          text: `Não temos '${missingName}' no momento 😕. Quer continuar o pedido sem esse item ou gostaria de adicionar outro no lugar?`,
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

      // Todos os itens reconhecidos: vai para a revisão
      replies.push({
        text: `${itemsListText(mergedState)}\n\nConfere? Quer adicionar, remover ou corrigir algum item?`,
        buttons: ["Está certo! Prosseguir", "Alterar pedido"],
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
              buttons: ["Está certo! Prosseguir", "Alterar pedido"],
            },
          ],
        };
      }

      // Cliente quer adicionar outro item no lugar
      if (n.includes("adicionar outro") || n.includes("outro") || n.includes("substituir")) {
        return keep([
          {
            text: "Pode me dizer qual produto você gostaria de colocar no lugar (ex: 'coloca 1kg de batata'):",
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
              text: `Adicionei à lista! Veja como ficou:\n\n${itemsListText(updatedState)}\n\nConfere? Quer adicionar, remover ou corrigir algum item?`,
              buttons: ["Está certo! Prosseguir", "Alterar pedido"],
            },
          ],
        };
      }

      return keep([
        {
          text: "Quer continuar o pedido sem o produto que não temos ou gostaria de adicionar outro?",
          buttons: ["Continuar sem esse item", "Adicionar outro item"],
        },
      ]);
    }

    case "review": {
      // 1. Confirmação positiva: segue para coleta de endereço
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
              text: "Perfeito! Agora vamos para o endereço de entrega.\n\nPor favor, digite o endereço de entrega em uma só linha (rua, número, bairro, complemento e ponto de referência, se tiver).",
            },
          ],
        };
      }

      // 2. Remoção de item solicitada pelo cliente
      const removal = extractRemoval(text, state.items);
      if (removal.removed) {
        const remaining = removal.remaining;
        if (remaining.length === 0) {
          return {
            state: { ...state, items: [], step: "items" },
            replies: [
              {
                text: `Removi ${removal.removed.name}. Sua lista agora está vazia. Pode me enviar uma nova lista de itens:`,
              },
            ],
          };
        }
        const updatedState = { ...state, items: remaining };
        return {
          state: updatedState,
          replies: [
            {
              text: `Removi *${removal.removed.name}* da lista! ✅\n\n${itemsListText(updatedState)}\n\nConfere? Quer adicionar, remover ou corrigir algum item?`,
              buttons: ["Está certo! Prosseguir", "Alterar pedido"],
            },
          ],
        };
      }

      // 3. Adição ou acréscimo de mais produtos
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
            text: `Aviso: não temos '${additions.unknown[0]}' no momento 😕.`,
          });
        }
        extraReplies.push({
          text: `Atualizei seu pedido! 🛒\n\n${itemsListText(updatedState)}\n\nConfere? Quer adicionar, remover ou corrigir algum item?`,
          buttons: ["Está certo! Prosseguir", "Alterar pedido"],
        });
        return {
          state: updatedState,
          replies: extraReplies,
        };
      }

            // Se o cliente mudou de ideia e quer manter como estava
      if (
        n === "deixa assim mesmo" ||
        n === "deixa assim" ||
        n === "nada" ||
        n === "nada nao" ||
        n === "nada não" ||
        n === "deixa como ta" ||
        n === "deixa como está" ||
        n === "pode deixar" ||
        n === "nao quero mudar nada" ||
        n === "não quero mudar nada" ||
        n === "cancela"
      ) {
        return keep([
          {
            text: `Perfeito, mantive seu pedido como estava! 👍\n\n${itemsListText(state)}\n\nPodemos prosseguir?`,
            buttons: ["Está certo! Prosseguir", "Alterar pedido"],
          },
        ]);
      }

      // Quando o cliente clica em "Alterar pedido" ou digita comandos de alteração
      if (
        n === "alterar pedido" ||
        n === "alterar" ||
        n.includes("mudar") ||
        n.includes("corrigir") ||
        n.includes("adicionar mais")
      ) {
        return keep([
          {
            text: "O que você gostaria de mudar? 😊\n\nVocê pode me dizer:\n• O que tirar (ex: *'tirar tomate'*)\n• O que adicionar (ex: *'mais 1kg de banana'*)\n• Ou enviar sua lista completa novamente.",
            buttons: ["Voltar ao início"],
          },
        ]);
      }

      // Se o usuário digitou novos itens diretamente (ex: "1kg de tomate")
      const directAdditions = parseItemsInput(text, products);
      if (directAdditions.items.length > 0) {
        const items = [...state.items];
        for (const item of directAdditions.items) {
          const existing = items.find((i) => i.productId === item.productId);
          if (existing) {
            existing.qty = Math.round((existing.qty + item.qty) * 1000) / 1000;
            existing.total = Math.round(existing.qty * existing.unitPrice * 100) / 100;
          } else {
            items.push(item);
          }
        }
        const updatedState = { ...state, items };
        const replies: BotReply[] = [];
        if (directAdditions.unknown.length > 0) {
          replies.push({
            text: `Aviso: não temos '${directAdditions.unknown[0]}' no momento.`,
          });
        }
        replies.push({
          text: `Atualizei seu pedido! 🛒\n\n${itemsListText(updatedState)}\n\nTudo certo agora?`,
          buttons: ["Está certo! Prosseguir", "Alterar pedido"],
        });
        return {
          state: updatedState,
          replies,
        };
      }

      return keep([
        {
          text: "Podemos prosseguir com esse pedido ou gostaria de ajustar algum item?",
          buttons: ["Está certo! Prosseguir", "Alterar pedido"],
        },
      ]);
    }

    case "address": {
      if (text.length < 5) {
        return keep([
          {
            text: "Por favor, digite o endereço completo em uma linha só (rua, número, bairro, complemento e ponto de referência, se tiver).",
          },
        ]);
      }

      // Aceita o texto corrido como está
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
            text: "Anotado! 📍\n\nE quem vai receber o pedido? Por favor, digite o seu nome.",
          },
        ],
      };
    }

    case "receiver_name": {
      if (text.length < 2) {
        return keep([
          {
            text: "Como é o nome de quem vai receber, por favor?",
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
            text: `Muito obrigado, ${text}! 😊\n\nSubtotal dos itens: ${brl(subtotalOf(state))}\nTaxa de entrega fixa: ${brl(DELIVERY_FEE)}\n*Total a pagar: ${brl(totalOf(state))}*\n\nComo você prefere fazer o pagamento?`,
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
              text: `Chave Pix do Cebolão (Copia e Cola):\n\`${PIX_KEY}\`\n\nVocê pode efetuar a transferência e nos enviar o comprovante após a confirmação.`,
            },
            {
              text: summaryText(nextState),
              buttons: ["Confirmar pedido", "Alterar forma de pagamento", "Alterar pedido"],
            },
          ],
        };
      }

      // 2. Cartão na Entrega
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
              buttons: ["Confirmar pedido", "Alterar forma de pagamento", "Alterar pedido"],
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
              text: `O total da compra é ${brl(totalOf(state))}.\n\nPrecisa de troco para quanto? (Se tiver o valor exato, pode responder 'não precisa')`,
            },
          ],
        };
      }

      return keep([
        {
          text: "Como você prefere fazer o pagamento?",
          buttons: PAYMENT_BUTTONS,
        },
      ]);
    }

    case "cash_change": {
      const total = totalOf(state);

      // Não precisa de troco
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
              buttons: ["Confirmar pedido", "Alterar forma de pagamento", "Alterar pedido"],
            },
          ],
        };
      }

      const match = text.replace(/[^\d,.]/g, "").replace(",", ".");
      const val = parseFloat(match);

      if (!val || Number.isNaN(val)) {
        return keep([
          {
            text: `Precisa de troco para quanto? Digite o valor da nota que vai pagar (ex: 50 ou 100), ou diga 'não precisa'. Seu total é ${brl(total)}.`,
          },
        ]);
      }

      if (val < total) {
        return keep([
          {
            text: `O total do pedido é ${brl(total)}. A nota de ${brl(val)} não cobre o valor. Precisa de troco para quanto?`,
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
            text: `Anotado! Troco de ${brl(trocoCalculado)} para a nota de ${brl(val)}. 💵`,
          },
          {
            text: summaryText(nextState),
            buttons: ["Confirmar pedido", "Alterar forma de pagamento", "Alterar pedido"],
          },
        ],
      };
    }

    case "confirm_final": {
      if (
        n === "alterar forma de pagamento" ||
        n === "alterar pagamento" ||
        n === "mudar pagamento" ||
        n === "trocar pagamento"
      ) {
        return {
          state: { ...state, step: "payment" },
          replies: [
            {
              text: "Sem problemas! Como você prefere fazer o pagamento?",
              buttons: PAYMENT_BUTTONS,
            },
          ],
        };
      }

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
              text: `Voltamos para a revisão dos itens:\n\n${itemsListText(state)}\n\nO que gostaria de adicionar, remover ou corrigir?`,
              buttons: ["Está certo! Prosseguir", "Alterar pedido"],
            },
          ],
        };
      }

      return keep([
        {
          text: "Podemos enviar esse pedido para a loja?",
          buttons: ["Confirmar pedido", "Alterar forma de pagamento", "Alterar pedido"],
        },
      ]);
    }

    default:
      return keep([{ text: WELCOME_TEXT, buttons: WELCOME_BUTTONS }], "start");
  }
}
