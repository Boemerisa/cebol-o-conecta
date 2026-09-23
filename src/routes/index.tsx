import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Check,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  Headset,
  PackageCheck,
  Truck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { OrderTicket, PaymentBanner } from "@/components/order-ticket";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ORDERS_KEY,
  SUPPORT_KEY,
  fetchOrders,
  fetchSupportRequests,
  resolveSupportRequest,
  updateChecked,
  updateOrderStatus,
} from "@/lib/data";
import { brl, qtyLabel } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
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
        content: "Pedidos organizados por status, com comanda para impressão térmica.",
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
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ORDERS_KEY,
    queryFn: fetchOrders,
    refetchInterval: 12000,
  });

  const { data: supportRequests = [] } = useQuery({
    queryKey: SUPPORT_KEY,
    queryFn: fetchSupportRequests,
    refetchInterval: 10000,
  });

  const [openId, setOpenId] = useState<string | null>(null);
  const [supportOpen, setSupportOpen] = useState(false);
  const previousNew = useRef<number | null>(null);
  const [alert, setAlert] = useState(false);

  const invalidateOrders = () => queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
  const invalidateSupport = () => queryClient.invalidateQueries({ queryKey: SUPPORT_KEY });

  // Assinatura em tempo real via Supabase Realtime
  useEffect(() => {
    try {
      const channel = supabase
        .channel("realtime_orders_and_support")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "orders" },
          () => {
            void invalidateOrders();
          },
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "support_requests" },
          () => {
            void invalidateSupport();
          },
        )
        .subscribe();

      return () => {
        void supabase.removeChannel(channel);
      };
    } catch {
      /* fallback para polling */
    }
  }, []);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: invalidateOrders,
    onError: () => toast.error("Não deu para salvar. Tente de novo."),
  });

  const checkMutation = useMutation({
    mutationFn: ({ id, checked }: { id: string; checked: string[] }) => updateChecked(id, checked),
    onSuccess: invalidateOrders,
    onError: () => toast.error("Não deu para salvar a marcação."),
  });

  const resolveMutation = useMutation({
    mutationFn: (id: string) => resolveSupportRequest(id),
    onSuccess: () => {
      invalidateSupport();
      toast.success("Atendimento marcado como resolvido!");
    },
    onError: () => toast.error("Erro ao atualizar o atendimento."),
  });

  const newCount = orders.filter((o) => o.status === "novo").length;

  useEffect(() => {
    if (previousNew.current != null && newCount > previousNew.current) {
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

  const current: Order | null = openId ? (orders.find((o) => o.id === openId) ?? null) : null;

  return (
    <div className="space-y-5 pb-24">
      {/* Cabeçalho da página com atalho para Conversas Pendentes */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold">Pedidos de hoje</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe a separação e entregas com comanda digital e troco calculado.
          </p>
        </div>

        {/* Botão de acesso rápido à lista isolada de Atendimento Humano */}
        <Button
          variant={supportRequests.length > 0 ? "hero" : "outline"}
          size="sm"
          onClick={() => setSupportOpen(true)}
          className="relative gap-2"
        >
          <Headset className="size-4" aria-hidden />
          Conversas Pendentes
          {supportRequests.length > 0 ? (
            <span className="ml-1 rounded-full bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">
              {supportRequests.length}
            </span>
          ) : null}
        </Button>
      </header>

      {/* Alerta de Conversas Pendentes para a dona da loja */}
      {supportRequests.length > 0 ? (
        <div className="flex flex-col gap-2 rounded-2xl border-2 border-amber-500/50 bg-amber-50 p-4 text-amber-950 shadow-sm md:flex-row md:items-center md:justify-between dark:bg-amber-950/40 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow">
              <Headset className="size-5" />
            </span>
            <div>
              <p className="text-base font-bold">
                {supportRequests.length} cliente(s) aguardando atendimento no WhatsApp!
              </p>
              <p className="text-xs text-amber-900/80 dark:text-amber-300/80">
                Clicaram em &quot;Falar com atendente&quot;. Esta lista é independente e não afeta os pedidos.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSupportOpen(true)}
            className="border-amber-600 bg-white font-bold text-amber-900 hover:bg-amber-100 dark:bg-amber-900 dark:text-white"
          >
            Ver Conversas ({supportRequests.length})
          </Button>
        </div>
      ) : null}

      {/* Alerta Sonoro e Visual de Pedido Novo */}
      {alert ? (
        <div className="animate-pulse rounded-xl border-2 border-primary bg-primary/15 p-4 text-base font-bold text-primary-strong">
          🔔 Chegou um pedido novo pelo WhatsApp!
        </div>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando pedidos…</p>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <p className="text-base font-semibold">Nenhum pedido ainda</p>
        </div>
      ) : null}

      {/* Colunas Kanban (100% preservadas e exclusivas para pedidos) */}
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
                    {order.address.receiver} • {order.address.neighborhood || order.address.street}
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
                    <Button variant="soft" size="xl" onClick={() => setOpenId(order.id)}>
                      Abrir comanda <ChevronRight aria-hidden />
                    </Button>
                    {column.next ? (
                      <Button
                        variant="hero"
                        size="xl"
                        onClick={() =>
                          statusMutation.mutate({ id: order.id, status: column.next! })
                        }
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

      {/* Modal da Comanda Térmica de Impressão */}
      <Dialog open={current != null} onOpenChange={(value) => !value && setOpenId(null)}>
        <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto">
          <DialogHeader className="no-print">
            <DialogTitle className="text-2xl">Comanda {current?.number}</DialogTitle>
          </DialogHeader>
          {current ? (
            <OrderTicket
              order={current}
              onToggleItem={(itemName) =>
                checkMutation.mutate({
                  id: current.id,
                  checked: current.checked.includes(itemName)
                    ? current.checked.filter((name) => name !== itemName)
                    : [...current.checked, itemName],
                })
              }
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Modal Independente de "Conversas Pendentes" (Atendimento Humano) */}
      <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
        <DialogContent className="max-h-[85vh] max-w-md overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Headset className="size-5 text-amber-600" />
              Conversas Pendentes
            </DialogTitle>
          </DialogHeader>

          <p className="text-xs text-muted-foreground">
            Clientes que solicitaram falar com a dona pelo WhatsApp. Não geram pedidos nem afetam a numeração.
          </p>

          <div className="mt-3 space-y-3">
            {supportRequests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                🎉 Nenhuma conversa pendente no momento. Todos os clientes foram atendidos!
              </div>
            ) : (
              supportRequests.map((req) => {
                const cleanPhone = req.customerPhone.replace(/\D/g, "");
                const waLink = cleanPhone ? `https://wa.me/55${cleanPhone}` : undefined;
                const formattedTime = new Date(req.createdAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={req.id}
                    className="flex flex-col gap-2 rounded-xl border border-amber-300/50 bg-amber-50/50 p-3 shadow-sm dark:bg-amber-950/20"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-foreground">{req.customerPhone || "Cliente WhatsApp"}</p>
                      <span className="text-xs text-muted-foreground">{formattedTime}</span>
                    </div>

                    <p className="text-xs text-foreground/80">{req.message}</p>

                    <div className="mt-2 flex gap-2">
                      {waLink ? (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-600 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300"
                        >
                          <ExternalLink className="size-3.5" />
                          Abrir WhatsApp
                        </a>
                      ) : null}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resolveMutation.mutate(req.id)}
                        className="flex-1 gap-1.5 border-neutral-300 text-xs font-semibold hover:bg-neutral-100"
                      >
                        <Check className="size-3.5 text-green-600" />
                        Marcar Atendido
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
