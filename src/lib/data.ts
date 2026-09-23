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

// ---------------------------------------------------------------------------
// Assistente do WhatsApp: gravação de pedidos e avisos de atendimento humano
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
const db = supabase as any;

export const SUPPORT_KEY = ["support-requests"] as const;

export interface SupportRequest {
  id: string;
  customerPhone: string;
  message: string;
  createdAt: string;
}

export async function createOrderFromBot(input: {
  customerPhone: string;
  items: Order["items"];
  subtotal: number;
  deliveryFee: number;
  total: number;
  payment: { method: PaymentMethod; cashFor?: number | null };
  address: Address;
  source: string;
}): Promise<string> {
  const cashFor = input.payment.cashFor ?? null;
  const change =
    input.payment.method === "cash" && cashFor != null
      ? Math.round((cashFor - input.total) * 100) / 100
      : null;

  const { data, error } = await db
    .from("orders")
    .insert({
      customer_phone: input.customerPhone,
      items: input.items,
      subtotal: input.subtotal,
      delivery_fee: input.deliveryFee,
      total: input.total,
      payment_method: input.payment.method,
      cash_for: cashFor,
      change_amount: change,
      address: input.address,
      status: "novo",
      source: input.source,
    })
    .select("id, number")
    .single();
  if (error) throw error;

  const row = data as { id: string; number: number };
  const { error: itemsError } = await db.from("order_items").insert(
    input.items.map((item) => ({
      order_id: row.id,
      product_id: item.productId,
      name: item.name,
      qty: item.qty,
      unit: item.unit,
      unit_price: item.unitPrice,
      total: item.total,
    })),
  );
  if (itemsError) throw itemsError;

  return `#${String(row.number).padStart(3, "0")}`;
}

export async function createSupportRequest(customerPhone: string): Promise<void> {
  const { error } = await db.from("support_requests").insert({
    customer_phone: customerPhone,
    message: "Cliente solicitou atendimento humano",
  });
  if (error) throw error;
}

export async function fetchSupportRequests(): Promise<SupportRequest[]> {
  const { data, error } = await db
    .from("support_requests")
    .select("id, customer_phone, message, created_at")
    .eq("handled", false)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as { id: string; customer_phone: string; message: string; created_at: string }[]).map(
    (row) => ({
      id: row.id,
      customerPhone: row.customer_phone,
      message: row.message,
      createdAt: row.created_at,
    }),
  );
}

export async function resolveSupportRequest(id: string): Promise<void> {
  const { error } = await db.from("support_requests").update({ handled: true }).eq("id", id);
  if (error) throw error;
}
