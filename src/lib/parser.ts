import type { OrderItem, Product } from "./types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP = new Set([
  "de",
  "da",
  "do",
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
  "duzia",
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
]);

/** Split raw customer text ("1kg de tomate, 2 alfaces e 1 leite") into item chunks. */
export function splitItems(text: string): string[] {
  return text
    .split(/[,\n;]+|\se\s(?=\d)|\smais\s/gi)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 1);
}

function parseQty(chunk: string): { qty: number; explicitUnit: "kg" | "un" | "pct" | null; rest: string } {
  const n = normalize(chunk);
  const grams = n.match(/(\d+(?:[.,]\d+)?)\s*(?:g|gramas?)\b/);
  if (grams?.[1]) {
    return {
      qty: parseFloat(grams[1].replace(",", ".")) / 1000,
      explicitUnit: "kg",
      rest: n.replace(grams[0], " "),
    };
  }
  const kilos = n.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|kilos?|quilos?)\b/);
  if (kilos?.[1]) {
    return {
      qty: parseFloat(kilos[1].replace(",", ".")),
      explicitUnit: "kg",
      rest: n.replace(kilos[0], " "),
    };
  }
  const meio = n.match(/\bmeio\s+(?:kilo|quilo|kg)\b/);
  if (meio) return { qty: 0.5, explicitUnit: "kg", rest: n.replace(meio[0], " ") };
  const pack = n.match(/(\d+)\s*(?:pacotes?|pct)\b/);
  if (pack?.[1]) return { qty: parseInt(pack[1], 10), explicitUnit: "pct", rest: n.replace(pack[0], " ") };
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
    .filter((t) => t.length > 2 && !STOP.has(t));
  let score = 0;
  for (const t of tokens) {
    for (const p of pTokens) {
      if (p === t) score += 3;
      else if (p.startsWith(t) || t.startsWith(p)) score += 2;
      else if (p.includes(t) || t.includes(p)) score += 1;
    }
  }
  return score;
}

export interface ParseResult {
  items: OrderItem[];
  unknown: string[];
  unavailable: string[];
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
      unknown.push(chunk.trim());
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
    if (!best || bestScore < 2) {
      unknown.push(chunk.trim());
      continue;
    }
    if (!best.available) {
      unavailable.push(best.name);
      continue;
    }
    const unit = explicitUnit && explicitUnit === best.unit ? explicitUnit : best.unit;
    const finalQty = unit === "kg" ? Math.round(qty * 1000) / 1000 : Math.max(1, Math.round(qty));
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