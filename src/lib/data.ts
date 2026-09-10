import { supabase } from "@/integrations/supabase/client";

import type { Address, Category, Order, OrderStatus, PaymentMethod, Product, Unit } from "./types";

export const PRODUCTS_KEY = ["products"] as const;
export const ORDERS_KEY = ["orders"] as const;

interface ProductRow {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number | string;
  available: boolean;
}

interface OrderRow {
  id: string;
  number: number;
  created_at: string;
  customer_phone: string;
  items: unknown;
  subtotal: number | string;
  delivery_fee: number | string;
  total: number | string;
  payment_method: string;
  cash_for: number | string | null;
  change_amount: number | string | null;
  address: unknown;
  status: string;
  checked: string[] | null;
  source: string;
}

const num = (value: number | string | null | undefined): number => Number(value ?? 0);

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category as Category,
    unit: row.unit as Unit,
    price: num(row.price),
    available: row.available,
  };
}

function toOrder(row: OrderRow): Order {
  const address = (row.address ?? {}) as Partial<Address>;
  const items = Array.isArray(row.items) ? (row.items as Order["items"]) : [];
  return {
    id: row.id,
    number: `#${String(row.number).padStart(3, "0")}`,
    createdAt: row.created_at,
    customerPhone: row.customer_phone,
    items: items.map((item) => ({
      productId: item.productId ?? null,
      name: item.name,
      qty: num(item.qty),
      unit: item.unit,
      unitPrice: num(item.unitPrice),
      total: num(item.total),
      raw: item.raw ?? item.name,
    })),
    subtotal: num(row.subtotal),
    deliveryFee: num(row.delivery_fee),
    total: num(row.total),
    payment: {
      method: row.payment_method as PaymentMethod,
      ...(row.cash_for != null ? { cashFor: num(row.cash_for) } : {}),
      ...(row.change_amount != null ? { change: num(row.change_amount) } : {}),
    },
    address: {
      street: address.street ?? "",
      number: address.number ?? "",
      neighborhood: address.neighborhood ?? "",
      complement: address.complement ?? "",
      reference: address.reference ?? "",
      receiver: address.receiver ?? "",
    },
    status: row.status as OrderStatus,
    checked: row.checked ?? [],
    source: (row.source === "whatsapp" ? "whatsapp" : "simulador") as Order["source"],
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, category, unit, price, available")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as ProductRow[]).map(toProduct);
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("number", { ascending: false });
  if (error) throw error;
  return (data as OrderRow[]).map(toOrder);
}

export async function createProduct(input: {
  name: string;
  category: Category;
  unit: Unit;
  price: number;
}): Promise<void> {
  const { error } = await supabase.from("products").insert({
    name: input.name,
    category: input.category,
    unit: input.unit,
    price: input.price,
    available: true,
  });
  if (error) throw error;
}

export async function updateProduct(
  id: string,
  patch: { price?: number; available?: boolean },
): Promise<void> {
  const { error } = await supabase.from("products").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function updateChecked(id: string, checked: string[]): Promise<void> {
  const { error } = await supabase.from("orders").update({ checked }).eq("id", id);
  if (error) throw error;
}
