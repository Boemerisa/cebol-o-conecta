import { Banknote, CreditCard, Printer, QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PIX_KEY, STORE_NAME } from "@/lib/catalog";
import { brl, qtyLabel } from "@/lib/format";
import type { Order } from "@/lib/types";

const PAYMENT_LABEL: Record<Order["payment"]["method"], string> = {
  pix: "PIX",
  card: "CARTÃO NA ENTREGA",
  cash: "DINHEIRO",
};

export function PaymentBanner({ order }: { order: Order }) {
  const method = order.payment.method;
  const Icon = method === "cash" ? Banknote : method === "card" ? CreditCard : QrCode;
  return (
    <div
      className={
        method === "cash"
          ? "rounded-lg border-2 border-destructive bg-destructive/10 p-3"
          : "rounded-lg border-2 border-warning bg-warning/20 p-3"
      }
    >
      <p className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wide">
        <Icon className="size-5" aria-hidden />
        {PAYMENT_LABEL[method]}
      </p>
      {method === "cash" && order.payment.cashFor ? (
        <p className="mt-1 text-lg font-extrabold uppercase text-destructive">
          Levar troco de {brl(order.payment.change ?? 0)} para nota de {brl(order.payment.cashFor)}
        </p>
      ) : null}
      {method === "card" ? (
        <p className="mt-1 text-sm font-bold uppercase">Avisar o motoboy: levar a maquininha</p>
      ) : null}
      {method === "pix" ? <p className="mt-1 text-sm font-bold">Chave PIX: {PIX_KEY}</p> : null}
    </div>
  );
}

export function OrderTicket({
  order,
  onToggleItem,
}: {
  order: Order;
  onToggleItem: (itemName: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="no-print space-y-4">
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="text-sm font-semibold text-muted-foreground">Separação — marque cada item</p>
          <ul className="mt-2 space-y-2">
            {order.items.map((item) => (
              <li key={item.name} className="flex items-center gap-3 rounded-md bg-muted/60 p-3">
                <Checkbox
                  id={`${order.id}-${item.name}`}
                  checked={order.checked.includes(item.name)}
                  onCheckedChange={() => onToggleItem(item.name)}
                  className="size-6"
                />
                <label
                  htmlFor={`${order.id}-${item.name}`}
                  className="flex flex-1 items-baseline justify-between gap-2 text-base font-semibold"
                >
                  <span>
                    {qtyLabel(item.qty, item.unit)} — {item.name}
                  </span>
                  <span className="text-muted-foreground">{brl(item.total)}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <PaymentBanner order={order} />

        <div className="rounded-lg border border-border bg-card p-3 text-sm">
          <p className="font-bold">Entrega</p>
          <p>
            {order.address.street}
            {order.address.number ? `, ${order.address.number}` : ""}
            {order.address.neighborhood ? ` — ${order.address.neighborhood}` : ""}
          </p>
          {order.address.complement ? <p>Compl.: {order.address.complement}</p> : null}
          {order.address.reference ? <p>Ref.: {order.address.reference}</p> : null}
          <p>Recebe: {order.address.receiver}</p>
          <p className="mt-2">
            Itens {brl(order.subtotal)} + entrega {brl(order.deliveryFee)} ={" "}
            <strong className="text-lg">{brl(order.total)}</strong>
          </p>
        </div>

        <Button variant="hero" size="xl" className="w-full" onClick={() => window.print()}>
          <Printer className="size-5" aria-hidden /> Imprimir comanda
        </Button>
      </div>

      <ThermalReceipt order={order} />
    </div>
  );
}

function ThermalReceipt({ order }: { order: Order }) {
  return (
    <div className="print-area mx-auto hidden max-w-[80mm] font-mono text-[12px] leading-tight">
      <p className="text-center font-bold uppercase">{STORE_NAME}</p>
      <p className="text-center">Comanda {order.number}</p>
      <p className="text-center">{new Date(order.createdAt).toLocaleString("pt-BR")}</p>
      <p>--------------------------------</p>
      {order.items.map((item) => (
        <p key={item.name}>
          [ ] {qtyLabel(item.qty, item.unit)} {item.name} .... {brl(item.total)}
        </p>
      ))}
      <p>--------------------------------</p>
      <p>Itens: {brl(order.subtotal)}</p>
      <p>Entrega: {brl(order.deliveryFee)}</p>
      <p className="font-bold">TOTAL: {brl(order.total)}</p>
      <p>--------------------------------</p>
      <p className="font-bold uppercase">PAGTO: {PAYMENT_LABEL[order.payment.method]}</p>
      {order.payment.method === "cash" && order.payment.cashFor ? (
        <p className="font-bold uppercase">
          LEVAR TROCO DE {brl(order.payment.change ?? 0)} PARA NOTA DE {brl(order.payment.cashFor)}
        </p>
      ) : null}
      {order.payment.method === "card" ? <p className="font-bold">LEVAR MAQUININHA</p> : null}
      <p>--------------------------------</p>
      <p>
        {order.address.street}
        {order.address.number ? `, ${order.address.number}` : ""}
      </p>
      {order.address.neighborhood ? <p>{order.address.neighborhood}</p> : null}
      {order.address.complement ? <p>Compl: {order.address.complement}</p> : null}
      {order.address.reference ? <p>Ref: {order.address.reference}</p> : null}
      <p>Recebe: {order.address.receiver}</p>
      <p>Tel: {order.customerPhone}</p>
      <p className="mt-1 text-center">Obrigada pela preferência!</p>
    </div>
  );
}