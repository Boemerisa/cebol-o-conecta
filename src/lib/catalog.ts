import type { Product } from "./types";

export const SEED_PRODUCTS: Product[] = [
  { id: "p01", name: "Banana Prata", category: "Hortifruti", unit: "kg", price: 6.99, available: true },
  { id: "p02", name: "Tomate", category: "Hortifruti", unit: "kg", price: 8.49, available: true },
  { id: "p03", name: "Batata Inglesa", category: "Hortifruti", unit: "kg", price: 5.79, available: true },
  { id: "p04", name: "Cebola", category: "Hortifruti", unit: "kg", price: 4.99, available: true },
  { id: "p05", name: "Alface Crespa (pé)", category: "Hortifruti", unit: "un", price: 3.5, available: true },
  { id: "p06", name: "Cenoura", category: "Hortifruti", unit: "kg", price: 5.49, available: true },
  { id: "p07", name: "Maçã Gala", category: "Hortifruti", unit: "kg", price: 9.9, available: true },
  { id: "p08", name: "Laranja Pera", category: "Hortifruti", unit: "kg", price: 4.29, available: true },
  { id: "p09", name: "Mamão Formosa", category: "Hortifruti", unit: "kg", price: 7.9, available: true },
  { id: "p10", name: "Arroz Tio João 5kg", category: "Mercearia", unit: "pct", price: 27.9, available: true },
  { id: "p11", name: "Feijão Carioca 1kg", category: "Mercearia", unit: "pct", price: 8.49, available: true },
  { id: "p12", name: "Óleo de Soja Liza 900ml", category: "Mercearia", unit: "un", price: 7.29, available: true },
  { id: "p13", name: "Açúcar Refinado 1kg", category: "Mercearia", unit: "pct", price: 4.79, available: true },
  { id: "p14", name: "Café Torrado 500g", category: "Mercearia", unit: "pct", price: 16.9, available: true },
  { id: "p15", name: "Macarrão Espaguete 500g", category: "Mercearia", unit: "pct", price: 4.59, available: true },
  { id: "p16", name: "Leite Integral 1L", category: "Laticínios e Frios", unit: "un", price: 5.49, available: true },
  { id: "p17", name: "Queijo Mussarela", category: "Laticínios e Frios", unit: "kg", price: 44.9, available: true },
  { id: "p18", name: "Presunto Fatiado", category: "Laticínios e Frios", unit: "kg", price: 32.9, available: true },
  { id: "p19", name: "Ovos (dúzia)", category: "Laticínios e Frios", unit: "un", price: 12.9, available: true },
  { id: "p20", name: "Refrigerante Cola 2L", category: "Bebidas", unit: "un", price: 9.99, available: true },
  { id: "p21", name: "Água Mineral 1,5L", category: "Bebidas", unit: "un", price: 3.49, available: true },
  { id: "p22", name: "Cerveja Lata 350ml", category: "Bebidas", unit: "un", price: 4.29, available: true },
  { id: "p23", name: "Detergente 500ml", category: "Limpeza", unit: "un", price: 2.99, available: true },
  { id: "p24", name: "Sabão em Pó 1kg", category: "Limpeza", unit: "pct", price: 12.5, available: true },
  { id: "p25", name: "Papel Higiênico 4 rolos", category: "Limpeza", unit: "pct", price: 8.9, available: true },
];

export const CATEGORIES = [
  "Hortifruti",
  "Mercearia",
  "Laticínios e Frios",
  "Bebidas",
  "Limpeza",
] as const;

export const NEIGHBORHOODS: { name: string; fee: number }[] = [
  { name: "Centro", fee: 5 },
  { name: "Vila Nova", fee: 7 },
  { name: "Jardim das Flores", fee: 8 },
  { name: "Alto da Serra", fee: 10 },
  { name: "Parque Industrial", fee: 12 },
];

export const PIX_KEY = "cebolao@emporio.com.br";

export const STORE_NAME = "Cebolão Empório e Verdurão";

/** Senha simples de 4 números para abrir o painel da loja. */
export const STORE_PIN = "1234";