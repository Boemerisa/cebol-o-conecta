export function brl(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function unitLabel(unit: "kg" | "un" | "pct"): string {
  return unit === "kg" ? "kg" : unit === "pct" ? "pct" : "un";
}

export function qtyLabel(qty: number, unit: "kg" | "un" | "pct"): string {
  if (unit === "kg") {
    return qty < 1 ? `${Math.round(qty * 1000)}g` : `${qty.toLocaleString("pt-BR")}kg`;
  }
  return `${qty} ${unit === "pct" ? "pct" : "un"}`;
}