import { useSyncExternalStore } from "react";

import { SEED_PRODUCTS } from "./catalog";
import type { Order, OrderStatus, Product } from "./types";

interface State {
  products: Product[];
  orders: Order[];
  counter: number;
}

const KEY = "cebolao-state-v1";

const initialState: State = { products: SEED_PRODUCTS, orders: [], counter: 0 };

let state: State = initialState;
let hydrated = false;
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function emit() {
  for (const l of listeners) l();
}

function setState(next: State) {
  state = next;
  persist();
  emit();
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as State;
      if (parsed.products?.length) {
        state = { products: parsed.products, orders: parsed.orders ?? [], counter: parsed.counter ?? 0 };
        emit();
      }
    }
  } catch {
    /* ignore */
  }
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => select(state),
    () => select(initialState),
  );
}

export function getProducts(): Product[] {
  return state.products;
}

export function nextOrderNumber(): string {
  return `#${String(state.counter + 1).padStart(3, "0")}`;
}

export function addOrder(order: Omit<Order, "id" | "number" | "createdAt" | "status" | "checked">): Order {
  const counter = state.counter + 1;
  const full: Order = {
    ...order,
    id: `${Date.now()}-${counter}`,
    number: `#${String(counter).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
    status: "novo",
    checked: [],
  };
  setState({ ...state, counter, orders: [full, ...state.orders] });
  return full;
}

export function setOrderStatus(id: string, status: OrderStatus) {
  setState({
    ...state,
    orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
  });
}

export function toggleChecked(orderId: string, itemName: string) {
  setState({
    ...state,
    orders: state.orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            checked: o.checked.includes(itemName)
              ? o.checked.filter((n) => n !== itemName)
              : [...o.checked, itemName],
          }
        : o,
    ),
  });
}

export function updateProduct(id: string, patch: Partial<Product>) {
  setState({
    ...state,
    products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
  });
}

export function addProduct(product: Omit<Product, "id">) {
  setState({
    ...state,
    products: [...state.products, { ...product, id: `p${Date.now()}` }],
  });
}

export function removeProduct(id: string) {
  setState({ ...state, products: state.products.filter((p) => p.id !== id) });
}