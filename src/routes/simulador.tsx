import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { RotateCcw, Send, Store } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ORDERS_KEY,
  PRODUCTS_KEY,
  SUPPORT_KEY,
  createOrderFromBot,
  createSupportRequest,
  fetchProducts,
} from "@/lib/data";
import {
  DELIVERY_FEE,
  WELCOME_BUTTONS,
  WELCOME_TEXT,
  advance,
  initialBotState,
  subtotalOf,
  summaryText,
  totalOf,
  type BotState,
} from "@/lib/bot";

export const Route = createFileRoute("/simulador")({
  head: () => ({
    meta: [
      { title: "Simulador WhatsApp | Cebolão Empório e Verdurão" },
      {
        name: "description",
        content:
          "Teste a conversa do assistente de pedidos do Cebolão: lista de compras, entrega, pagamento e troco.",
      },
      { property: "og:title", content: "Simulador WhatsApp | Cebolão" },
      {
        property: "og:description",
        content: "Simule um pedido pelo WhatsApp e veja ele cair no painel da loja.",
      },
    ],
  }),
  component: SimuladorPage,
});

interface ChatMessage {
  id: string;
  from: "bot" | "client";
  text: string;
  buttons?: string[];
  time: string;
}

const CLIENT_PHONE = "11999990000";

const now = () =>
  new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

let seq = 0;
const nextId = () => `m${++seq}`;

function welcomeMessage(): ChatMessage {
  return {
    id: nextId(),
    from: "bot",
    text: WELCOME_TEXT,
    buttons: WELCOME_BUTTONS,
    time: now(),
  };
}

function SimuladorPage() {
  const queryClient = useQueryClient();
  const { data: products = [] } = useQuery({ queryKey: PRODUCTS_KEY, queryFn: fetchProducts });

  const [messages, setMessages] = useState<ChatMessage[]>(() => [welcomeMessage()]);
  const [state, setState] = useState<BotState>(initialBotState);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const supportMutation = useMutation({
    mutationFn: () => createSupportRequest(CLIENT_PHONE),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SUPPORT_KEY });
      toast.info("Aviso enviado ao painel: cliente quer falar com a dona.");
    },
  });

  const orderMutation = useMutation({
    mutationFn: (finished: BotState) =>
      createOrderFromBot({
        customerPhone: CLIENT_PHONE,
        items: finished.items,
        subtotal: subtotalOf(finished),
        deliveryFee: DELIVERY_FEE,
        total: totalOf(finished),
        payment: { method: finished.payment ?? "pix", cashFor: finished.cashFor },
        address: finished.address,
        source: "whatsapp",
      }),
    onSuccess: (number, finished) => {
      void queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
      pushBot([
        {
          text: `${summaryText(finished, number)}\n\nJá mandei para a separação. Obrigada pela preferência! 🧅💚`,
        },
        { text: "Quer fazer outro teste?", buttons: WELCOME_BUTTONS },
      ]);
    },
    onError: (error: Error) => {
      toast.error("Não foi possível salvar o pedido.");
      pushBot([{ text: `Ops, deu um problema ao salvar: ${error.message}` }]);
    },
  });

  function pushBot(replies: { text: string; buttons?: string[] }[]) {
    setMessages((prev) => [
      ...prev,
      ...replies.map((reply) => ({
        id: nextId(),
        from: "bot" as const,
        text: reply.text,
        ...(reply.buttons ? { buttons: reply.buttons } : {}),
        time: now(),
      })),
    ]);
  }

  function send(text: string) {
    const clean = text.trim();
    if (!clean || busy) return;
    setDraft("");
    setMessages((prev) => [
      ...prev,
      { id: nextId(), from: "client", text: clean, time: now() },
    ]);
    setBusy(true);
    const result = advance(state, clean, products);
    setState(result.state);
    window.setTimeout(() => {
      pushBot(result.replies);
      setBusy(false);
      if (result.action === "human") supportMutation.mutate();
      if (result.action === "create_order") orderMutation.mutate(result.state);
    }, 550);
  }

  function restart() {
    setState(initialBotState());
    setMessages([welcomeMessage()]);
    setDraft("");
  }

  const lastButtons =
    messages.length > 0 ? messages[messages.length - 1]?.buttons ?? [] : [];

  return (
    <div className="mx-auto w-full max-w-md pb-24">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h1 className="text-lg font-bold text-foreground">Simulador WhatsApp</h1>
        <Button variant="outline" size="sm" onClick={restart} className="gap-2">
          <RotateCcw className="size-4" aria-hidden />
          Reiniciar conversa
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3 bg-[image:var(--gradient-fresh)] px-3 py-2 text-primary-foreground">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/20 text-xl">
            🧅
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">Cebolão Empório e Verdurão</p>
            <p className="text-xs opacity-90">online</p>
          </div>
          <Store className="ml-auto size-5 opacity-80" aria-hidden />
        </div>

        <div className="h-[60vh] space-y-2 overflow-y-auto bg-secondary/40 px-3 py-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-1">
              <div
                className={
                  message.from === "client"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary/15 px-3 py-2"
                    : "mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-card px-3 py-2 shadow-sm"
                }
              >
                <p className="whitespace-pre-wrap text-sm leading-snug text-foreground">
                  {message.text}
                </p>
                <p className="mt-1 text-right text-[10px] text-muted-foreground">{message.time}</p>
              </div>
              {message.buttons?.length ? (
                <div className="mr-auto grid max-w-[85%] gap-1">
                  {message.buttons.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => send(label)}
                      className="rounded-xl border border-primary/40 bg-card px-3 py-2 text-sm font-semibold text-primary-strong hover:bg-primary/10"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          {busy ? (
            <p className="text-xs italic text-muted-foreground">digitando…</p>
          ) : null}
          <div ref={endRef} />
        </div>

        <form
          className="flex items-center gap-2 border-t border-border bg-card px-3 py-2"
          onSubmit={(event) => {
            event.preventDefault();
            send(draft);
          }}
        >
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Escreva como o cliente…"
            className="rounded-full"
          />
          <Button type="submit" size="icon" className="rounded-full" aria-label="Enviar">
            <Send className="size-4" aria-hidden />
          </Button>
        </form>
      </div>

      {lastButtons.length === 0 && state.step === "items" ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Dica: escreva algo como “1kg de tomate, 2 pés de alface e 500g de cebola”.
        </p>
      ) : null}
    </div>
  );
}
