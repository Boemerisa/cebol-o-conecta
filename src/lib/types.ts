export type Unit = "kg" | "un" | "pct";

export type Category =
  | "Hortifruti"
  | "Mercearia"
  | "Laticínios e Frios"
  | "Bebidas"
  | "Limpeza";

export interface Product {
  id: string;
  name: string;
  category: Category;
  unit: Unit;
  price: number;
  available: boolean;
}

export interface OrderItem {
  productId: string | null;
  name: string;
  qty: number;
  unit: Unit;
  unitPrice: number;
  total: number;
  raw: string;
}

export type PaymentMethod = "pix" | "card" | "cash";

export interface Address {
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  reference: string;
  receiver: string;
}

export type OrderStatus = "novo" | "separacao" | "entrega" | "finalizado";

export interface Order {
  id: string;
  number: string;
  createdAt: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  payment: { method: PaymentMethod; cashFor?: number; change?: number };
  address: Address;
  status: OrderStatus;
  checked: string[];
  source: "simulador" | "whatsapp";
}