import type { OrderItem, Product } from "./types";

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Remove final 's' ou 'es' para aproximar singular/plural em português */
function stem(word: string): string {
  if (word.endsWith("oes")) return word.slice(0, -3) + "ao";
  if (word.endsWith("es") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("s") && word.length > 3) return word.slice(0, -1);
  return word;
}

const STOP = new Set([
  "de",
  "da",
  "do",
  "dos",
  "das",
  "e",
  "kg",
  "kilo",
  "kilos",
  "quilo",
  "quilos",
  "g",
  "gramas",
  "grama",
  "un",
  "unidade",
  "unidades",
  "pacote",
  "pacotes",
  "pct",
  "pe",
  "pes",
  "maco",
  "macos",
  "duzia",
  "duzias",
  "litro",
  "litros",
  "ml",
  "l",
  "por",
  "favor",
  "quero",
  "queria",
  "me",
  "ve",
  "coloca",
  "manda",
  "mais",
  "tambem",
  "pra",
  "mim",
]);

/** Divide o texto corrido do cliente ("1kg de tomate, 500g de cebola e 2 alfaces") em blocos de itens. */
export function splitItems(text: string): string[] {
  // Insere um separador antes de novas quantidades quando o utilizador escreve sem pontuação
  const normalized = text.replace(
    new RegExp("(?<=[a-zA-Zá-úÁ-Ú)])\\s+(?=(\\d+(?:[.,]\\d+)?(?:\\s*(?:kg|kilos?|g|gramas?|un|und|unidades?|dz|duzias?|dúzias?|pes?|pés?|pct|pacotes?))?\\b|\\bmeio\\b|\\bum\\b|\\buma\\b))", "gi"),
    ", "
  );

  const splitPattern = new RegExp("[,;\\n]+|\\se\\s(?=\\d|\\bmeio\\b|\\bum\\b|\\buma\\b)|\\smais\\s(?=\\d|\\bmeio\\b|\\bum\\b|\\buma\\b)", "gi");

  return normalized
    .split(splitPattern)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);
}

export function parseQty(chunk: string): { qty: number; explicitUnit: "kg" | "un" | "pct" | null; rest: string } {
  const n = normalize(chunk);

  // 1. Frações em gramas (ex: "500g", "250g", "100 gramas", "750 gramas")
  const grams = n.match(/(\d+(?:[.,]\d+)?)\s*(?:g|gramas?)\b/);
  if (grams?.[1]) {
    const val = parseFloat(grams[1].replace(",", "."));
    return {
      qty: Math.round((val / 1000) * 1000) / 1000,
      explicitUnit: "kg",
      rest: n.replace(grams[0], " "),
    };
  }

  // 2. Fração "1 e meio kg", "1 quilo e meio", "2kg e meio"
  const oneAndHalf = n.match(/(\d+)\s*(?:e\s*meio|e\s*meia)\s*(?:kg|kilos?|quilos?)\b/) ||
                     n.match(/(\d+)\s*(?:kg|kilos?|quilos?)\s*e\s*meio\b/);
  if (oneAndHalf?.[1]) {
    return {
      qty: parseFloat(oneAndHalf[1]) + 0.5,
      explicitUnit: "kg",
      rest: n.replace(oneAndHalf[0], " "),
    };
  }

  // 3. "Meio kg", "meio quilo", "1/2 kg"
  const meioKg = n.match(/\b(?:meio|1\/2)\s*(?:kilo|quilo|kg)\b/);
  if (meioKg) {
    return { qty: 0.5, explicitUnit: "kg", rest: n.replace(meioKg[0], " ") };
  }

  // 4. "Meia dúzia"
  const meiaDuzia = n.match(/\bmeia\s*(?:duzia|duzias)\b/);
  if (meiaDuzia) {
    return { qty: 0.5, explicitUnit: "un", rest: n.replace(meiaDuzia[0], " ") };
  }

  // 5. Quilos regulares (ex: "1kg", "1,5kg", "2 kilos", "3 quilos")
  const kilos = n.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|kilos?|quilos?)\b/);
  if (kilos?.[1]) {
    return {
      qty: parseFloat(kilos[1].replace(",", ".")),
      explicitUnit: "kg",
      rest: n.replace(kilos[0], " "),
    };
  }

  // 6. Maço / maços (ex: "2 maços de alface", "1 maco")
  const maco = n.match(/(\d+)\s*(?:macos?|maços?)\b/);
  if (maco?.[1]) {
    return {
      qty: parseInt(maco[1], 10),
      explicitUnit: "un",
      rest: n.replace(maco[0], " "),
    };
  }

  // 7. Pés de verdura (ex: "2 pés de alface", "1 pe")
  const pe = n.match(/(\d+)\s*(?:pes?|pés?)\b/);
  if (pe?.[1]) {
    return {
      qty: parseInt(pe[1], 10),
      explicitUnit: "un",
      rest: n.replace(pe[0], " "),
    };
  }

  // 8. Pacotes / pct / sacos (ex: "2 pacotes", "1 pct", "2 sacos")
  const pack = n.match(/(\d+)\s*(?:pacotes?|pct|sacos?)\b/);
  if (pack?.[1]) {
    return {
      qty: parseInt(pack[1], 10),
      explicitUnit: "pct",
      rest: n.replace(pack[0], " "),
    };
  }

  // 9. Dúzia (ex: "1 dúzia", "2 duzias")
  const duzia = n.match(/(\d+)\s*(?:duzias?|dúzias?)\b/);
  if (duzia?.[1]) {
    return {
      qty: parseInt(duzia[1], 10),
      explicitUnit: "un",
      rest: n.replace(duzia[0], " "),
    };
  }

  // 10. Unidades explícitas (ex: "3 unidades", "2 un")
  const unMatch = n.match(/(\d+)\s*(?:unidades?|unids?|un)\b/);
  if (unMatch?.[1]) {
    return {
      qty: parseInt(unMatch[1], 10),
      explicitUnit: "un",
      rest: n.replace(unMatch[0], " "),
    };
  }

  // 11. Palavras numéricas "um", "uma", "dois", "duas", "tres"
  const wordNumbers: Record<string, number> = {
    um: 1,
    uma: 1,
    dois: 2,
    duas: 2,
    tres: 3,
    quatro: 4,
    cinco: 5,
  };
  for (const [w, val] of Object.entries(wordNumbers)) {
    const r = new RegExp(`\\b${w}\\b`, "i");
    if (r.test(n)) {
      return { qty: val, explicitUnit: null, rest: n.replace(r, " ") };
    }
  }

  // 12. Número avulso (ex: "2 tomate", "1.5 cebola")
  const plain = n.match(/(\d+(?:[.,]\d+)?)/);
  if (plain?.[1]) {
    return {
      qty: parseFloat(plain[1].replace(",", ".")),
      explicitUnit: null,
      rest: n.replace(plain[0], " "),
    };
  }

  return { qty: 1, explicitUnit: null, rest: n };
}

function scoreProduct(tokens: string[], product: Product): number {
  const pTokens = normalize(product.name)
    .replace(/[()]/g, " ")
    .split(" ")
    .map(stem)
    .filter((t) => t.length > 2 && !STOP.has(t));

  let score = 0;
  for (const token of tokens) {
    const sToken = stem(token);
    for (const p of pTokens) {
      if (p === sToken) {
        score += 4;
      } else if (p.startsWith(sToken) || sToken.startsWith(p)) {
        score += 2.5;
      } else if (p.includes(sToken) || sToken.includes(p)) {
        score += 1.5;
      }
    }
  }
  return score;
}

export interface ParseResult {
  items: OrderItem[];
  unknown: string[];
  unavailable: string[];
}

/** Limpa uma string desconhecida para deixar apenas o nome do produto mencionado */
export function cleanUnknownName(chunk: string): string {
  const n = normalize(chunk);
  const words = n
    .replace(/[^a-z0-9 ]/g, " ")
    .split(" ")
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOP.has(w) && !/^\d+$/.test(w));
  return words.length ? words.join(" ") : chunk.trim();
}

export function parseOrderText(text: string, products: Product[]): ParseResult {
  const items: OrderItem[] = [];
  const unknown: string[] = [];
  const unavailable: string[] = [];

  for (const chunk of splitItems(text)) {
    const { qty, explicitUnit, rest } = parseQty(chunk);
    const tokens = rest
      .replace(/[^a-z0-9 ]/g, " ")
      .split(" ")
      .map((t) => t.trim())
      .filter((t) => t.length > 1 && !STOP.has(t) && !/^\d+$/.test(t));

    if (tokens.length === 0) {
      const clean = cleanUnknownName(chunk);
      if (clean) unknown.push(clean);
      continue;
    }

    let best: Product | null = null;
    let bestScore = 0;
    for (const product of products) {
      const score = scoreProduct(tokens, product);
      if (score > bestScore) {
        bestScore = score;
        best = product;
      }
    }

    // Se o score for muito baixo (< 2.5), considera produto não reconhecido
    if (!best || bestScore < 2.5) {
      const clean = cleanUnknownName(chunk);
      if (clean) unknown.push(clean);
      continue;
    }

    if (!best.available) {
      unavailable.push(best.name);
      continue;
    }

    const unit = explicitUnit && explicitUnit === best.unit ? explicitUnit : best.unit;
    // Se for por kg, permite decimais; se for unidade/pacote, mínimo 1
    const finalQty =
      unit === "kg"
        ? Math.round(qty * 1000) / 1000
        : Math.max(1, Math.round(qty));

    const existing = items.find((i) => i.productId === best!.id);
    if (existing) {
      existing.qty = Math.round((existing.qty + finalQty) * 1000) / 1000;
      existing.total = Math.round(existing.qty * existing.unitPrice * 100) / 100;
      continue;
    }

    items.push({
      productId: best.id,
      name: best.name,
      qty: finalQty,
      unit,
      unitPrice: best.price,
      total: Math.round(finalQty * best.price * 100) / 100,
      raw: chunk.trim(),
    });
  }

  return { items, unknown, unavailable };
}

export function sum(items: OrderItem[]): number {
  return Math.round(items.reduce((acc, i) => acc + i.total, 0) * 100) / 100;
}

/**
 * Detecta se o cliente pediu para remover algum item na revisão.
 * Ex: "tirar tomate", "remover cebola", "sem o arroz", "cancela a banana", "tira o 1"
 */
export function extractRemoval(
  text: string,
  items: OrderItem[],
): { removed: OrderItem | null; remaining: OrderItem[] } {
  const n = normalize(text);
  const isRemovalIntent =
    n.startsWith("tira") ||
    n.startsWith("remover") ||
    n.startsWith("remova") ||
    n.startsWith("tirar") ||
    n.startsWith("sem ") ||
    n.startsWith("cancela") ||
    n.startsWith("apaga") ||
    n.includes("nao quero") ||
    n.includes("retirar");

  if (!isRemovalIntent) {
    return { removed: null, remaining: items };
  }

  // Tenta por índice numérico (ex: "tira o 1", "remover item 2")
  const numMatch = n.match(/\b(?:item\s*)?(\d+)\b/);
  if (numMatch?.[1]) {
    const idx = parseInt(numMatch[1], 10) - 1;
    if (idx >= 0 && idx < items.length) {
      const removed = items[idx];
      return {
        removed,
        remaining: items.filter((_, i) => i !== idx),
      };
    }
  }

  // Tenta por nome do item
  const words = n
    .replace(/^(tira[r]?|remove[r]?|remova|sem|cancela[r]?|apaga[r]?|retira[r]?|nao quero|o|a|os|as|do|da|de)\s+/gi, "")
    .trim()
    .split(" ")
    .map(stem)
    .filter((w) => w.length > 2 && !STOP.has(w));

  let bestMatch: OrderItem | null = null;
  let bestScore = 0;

  for (const item of items) {
    const itemTokens = normalize(item.name)
      .replace(/[()]/g, " ")
      .split(" ")
      .map(stem);
    let score = 0;
    for (const w of words) {
      if (itemTokens.some((t) => t === w || t.includes(w) || w.includes(t))) {
        score += 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && bestScore > 0) {
    return {
      removed: bestMatch,
      remaining: items.filter((i) => i !== bestMatch),
    };
  }

  return { removed: null, remaining: items };
}

export function matchNeighborhood(
  text: string,
  list: { name: string; fee: number }[],
): { name: string; fee: number } | null {
  const n = normalize(text);
  let best: { name: string; fee: number } | null = null;
  let bestScore = 0;
  for (const item of list) {
    const tokens = normalize(item.name)
      .split(" ")
      .filter((t) => t.length > 2);
    const score = tokens.reduce((acc, t) => acc + (n.includes(t) ? 2 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return best;
}