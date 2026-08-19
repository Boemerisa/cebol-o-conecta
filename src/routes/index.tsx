import { createFileRoute } from "@tanstack/react-router";
import { Bell, ChevronRight, ClipboardList, PackageCheck, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { OrderTicket, PaymentBanner } from "@/components/order-ticket";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { brl, qtyLabel } from "@/lib/format";
import { setOrderStatus, useStore } from "@/lib/store";
import type { Order, OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel de Pedidos | Cebolão Empório e Verdurão" },
      {
        name: "description",
        content:
          "Painel da loja: acompanhe pedidos novos, separação e entregas com comanda digital e troco calculado.",
      },
      { property: "og:title", content: "Painel de Pedidos | Cebolão Empório e Verdurão" },
      {
        property: "og:description",
        content: "Pedidos do WhatsApp organizados por status, com comanda para impressão térmica.",
      },
    ],
  }),
  component: Painel,
});

const COLUMNS: { status: OrderStatus; label: string; next?: OrderStatus; nextLabel?: string }[] = [
  { status: "novo", label: "Novo pedido", next: "separacao", nextLabel: "Começar separação" },
  { status: "separacao", label: "Em separação", next: "entrega", nextLabel: "Saiu para entrega" },
  { status: "entrega", label: "Saiu para entrega", next: "finalizado", nextLabel: "Finalizar" },
  { status: "finalizado", label: "Finalizado" },
];

const ICONS = {
  novo: Bell,
  separacao: ClipboardList,
  entrega: Truck,
  finalizado: PackageCheck,
} as const;

function Painel() {
  const orders = useStore((s) => s.orders);
  const [open, setOpen] = useState<Order | null>(null);
  const previousNew = useRef(0);
  const [alert, setAlert] = useState(false);

  const newCount = orders.filter((o) => o.status === "novo").length;

  useEffect(() => {
    if (newCount > previousNew.current) {
      setAlert(true);
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 880;
        gain.gain.value = 0.08;
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } catch {
        /* som opcional */
      }
      const timer = setTimeout(() => setAlert(false), 4000);
      previousNew.current = newCount;
      return () => clearTimeout(timer);
    }
    previousNew.current = newCount;
    return;
  }, [newCount]);

  const current = open ? (orders.find((o) => o.id === open.id) ?? null) : null;

  return (
    <div className="space-y-5 pb-24">
      <header className="space-y-1">
        <h1 className="text-2xl font-extrabold">Pedidos de hoje</h1>
        <p className="text-sm text-muted-foreground">
          Toque no pedido para abrir a comanda, marcar os itens e imprimir.
        </p>
      </header>

      {alert ? (
        <div className="animate-pulse rounded-xl border-2 border-primary bg-primary/15 p-4 text-base font-bold text-primary-strong">
          🔔 Chegou pedido novo no WhatsApp!
        </div>
      ) : null}

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <p className="text-base font-semibold">Nenhum pedido ainda</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Use a aba Simulador para criar um pedido de teste.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((column) => {
          const list = orders.filter((o) => o.status === column.status);
          const Icon = ICONS[column.status];
          return (
            <section key={column.status} className="space-y-3">
              <h2 className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm font-bold uppercase tracking-wide text-secondary-foreground">
                <Icon className="size-4" aria-hidden />
                {column.label}
                <span className="ml-auto rounded-full bg-card px-2 py-0.5">{list.length}</span>
              </h2>
              {list.map((order) => (
                <article
                  key={order.id}
                  className={`rounded-2xl border bg-card p-4 shadow-sm ${
                    order.status === "novo" ? "border-primary" : "border-border"
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <p className="text-lg font-extrabold">{order.number}</p>
                    <p className="text-xl font-extrabold text-primary-strong">{brl(order.total)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.address.receiver} • {order.address.neighborhood}
                  </p>
                  <ul className="mt-2 space-y-0.5 text-sm">
                    {order.items.slice(0, 3).map((item) => (
                      <li key={item.name}>
                        {qtyLabel(item.qty, item.unit)} {item.name}
                      </li>
                    ))}
                    {order.items.length > 3 ? (
                      <li className="text-muted-foreground">
                        + {order.items.length - 3} item(ns)
                      </li>
                    ) : null}
                  </ul>
                  <div className="mt-3">
                    <PaymentBanner order={order} />
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    <Button variant="soft" size="xl" onClick={() => setOpen(order)}>
                      Abrir comanda <ChevronRight aria-hidden />
                    </Button>
                    {column.next ? (
                      <Button
                        variant="hero"
                        size="xl"
                        onClick={() => setOrderStatus(order.id, column.next!)}
                      >
                        {column.nextLabel}
                      </Button>
                    ) : null}
                  </div>
                </article>
              ))}
            </section>
          );
        })}
      </div>

      <Dialog open={current != null} onOpenChange={(value) => !value && setOpen(null)}>
        <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto">
          <DialogHeader className="no-print">
            <DialogTitle className="text-2xl">Comanda {current?.number}</DialogTitle>
          </DialogHeader>
          {current ? <OrderTicket order={current} /> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}