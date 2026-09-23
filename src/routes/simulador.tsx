import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCheck,
  MoreVertical,
  Paperclip,
  Phone,
  RotateCcw,
  Send,
  Smile,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
          "Teste o assistente oficial de pedidos do WhatsApp do Cebolão com layout idêntico ao celular.",
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

const CLIENT_PHONE = "(62) 99988-7766";

const now = () =>
  new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

let seq = 0;
const nextId = () => `msg_${Date.now()}_${++seq}`;

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
  const { data: products = [] } = useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: fetchProducts,
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => [welcomeMessage()]);
  const [state, setState] = useState<BotState>(initialBotState);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const supportMutation = useMutation({
    mutationFn: (clientMessage: string) =>
      createSupportRequest(CLIENT_PHONE, clientMessage),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SUPPORT_KEY });
      toast.info("Aviso enviado ao painel da loja: cliente na lista 'Conversas Pendentes'.", {
        duration: 4000,
      });
    },
    onError: () => {
      toast.error("Erro ao registrar atendimento humano.");
    },
  });

  const orderMutation = useMutation({
    mutationFn: (finishedState: BotState) =>
      createOrderFromBot({
        customerPhone: CLIENT_PHONE,
        items: finishedState.items,
        subtotal: subtotalOf(finishedState),
        deliveryFee: DELIVERY_FEE,
        total: totalOf(finishedState),
        payment: {
          method: finishedState.payment ?? "pix",
          cashFor: finishedState.cashFor,
        },
        address: finishedState.address,
        source: "whatsapp",
      }),
    onSuccess: (orderNumber, finishedState) => {
      void queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
      // Adiciona o resumo final e confirmação na tela do WhatsApp
      pushBotReplies([
        {
          text: `${summaryText(finishedState, orderNumber)}\n\n🛵 *Seu pedido já caiu na tela de separação da loja!* Avisaremos quando sair para entrega. Muito obrigado pela preferência! 🧅💚`,
        },
        {
          text: "Deseja fazer mais algum teste?",
          buttons: WELCOME_BUTTONS,
        },
      ]);
      toast.success(`Pedido ${orderNumber} gravado com sucesso no Supabase!`, {
        duration: 5000,
      });
    },
    onError: (err: Error) => {
      toast.error(`Erro ao salvar pedido: ${err.message}`);
      pushBotReplies([
        {
          text: `Ops! Ocorreu um problema ao registrar seu pedido: ${err.message}. A dona da loja já foi avisada.`,
        },
      ]);
    },
  });

  function pushBotReplies(replies: { text: string; buttons?: string[] }[]) {
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

  function handleSend(textToSend: string) {
    const clean = textToSend.trim();
    if (!clean || typing) return;

    setDraft("");
    // Adiciona balão do cliente
    setMessages((prev) => [
      ...prev,
      { id: nextId(), from: "client", text: clean, time: now() },
    ]);

    setTyping(true);

    // Processa pelo motor conversacional
    const result = advance(state, clean, products);
    setState(result.state);

    window.setTimeout(() => {
      setTyping(false);
      pushBotReplies(result.replies);

      if (result.action === "human") {
        supportMutation.mutate(clean);
      }
      if (result.action === "create_order") {
        orderMutation.mutate(result.state);
      }
    }, 600);
  }

  function handleRestart() {
    setState(initialBotState());
    setMessages([welcomeMessage()]);
    setDraft("");
    setTyping(false);
    toast.info("Conversa reiniciada. O bot enviou a saudação inicial.");
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center pb-24">
      {/* Barra de controle superior */}
      <div className="mb-3 flex w-full items-center justify-between px-1">
        <div>
          <h1 className="text-xl font-black text-foreground">Simulador WhatsApp</h1>
          <p className="text-xs text-muted-foreground">
            Interaja exatamente como um cliente pelo celular
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRestart}
          className="gap-2 border-emerald-600/40 text-emerald-800 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
        >
          <RotateCcw className="size-4 text-emerald-600" aria-hidden />
          Reiniciar Conversa / Novo Teste
        </Button>
      </div>

      {/* Frame do Smartphone com interface WhatsApp */}
      <div className="w-full overflow-hidden rounded-[2.5rem] border-[8px] border-neutral-800 bg-neutral-900 shadow-2xl">
        {/* Entalhe / Speakerphone do smartphone */}
        <div className="relative flex h-6 w-full items-center justify-center bg-neutral-800">
          <div className="h-3.5 w-24 rounded-full bg-neutral-900" />
        </div>

        {/* WhatsApp App Container */}
        <div className="flex h-[680px] flex-col bg-[#efeae2]">
          {/* Cabeçalho Oficial do WhatsApp */}
          <header className="flex items-center gap-2 bg-[#008069] px-3 py-2.5 text-white shadow-md">
            <button
              type="button"
              onClick={handleRestart}
              className="rounded-full p-1 transition-colors hover:bg-white/10"
              title="Voltar / Reiniciar"
            >
              <ArrowLeft className="size-5" />
            </button>

            {/* Foto de Perfil */}
            <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-2xl shadow-inner">
              🧅
              <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#008069] bg-green-400" />
            </div>

            {/* Nome e Status */}
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-bold leading-tight">
                Cebolão Empório e Verdurão
              </h2>
              <p className="text-xs text-emerald-100">online</p>
            </div>

            {/* Ícones de ação do WhatsApp */}
            <div className="flex items-center gap-3 text-emerald-100">
              <button
                type="button"
                className="hover:text-white"
                onClick={() => toast.info("Ligação por voz não disponível no simulador.")}
              >
                <Video className="size-5" />
              </button>
              <button
                type="button"
                className="hover:text-white"
                onClick={() => toast.info("Ligação de áudio não disponível no simulador.")}
              >
                <Phone className="size-4" />
              </button>
              <button
                type="button"
                className="hover:text-white"
                onClick={() => toast.info("Opções do WhatsApp")}
              >
                <MoreVertical className="size-5" />
              </button>
            </div>
          </header>

          {/* Área do Chat com Papel de Parede do WhatsApp */}
          <div
            className="flex-1 space-y-3 overflow-y-auto p-3"
            style={{
              backgroundImage: `radial-gradient(#d3c9be 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          >
            {/* Aviso de Criptografia do WhatsApp */}
            <div className="mx-auto my-1 max-w-[85%] rounded-lg bg-[#ffeecd] px-3 py-1.5 text-center text-[11px] leading-tight text-[#54656f] shadow-sm">
              🔒 As mensagens são protegidas com criptografia de ponta a ponta.
            </div>

            {/* Lista de Mensagens */}
            {messages.map((message) => {
              const isBot = message.from === "bot";
              return (
                <div key={message.id} className="space-y-1.5">
                  <div
                    className={`relative max-w-[84%] rounded-xl px-3.5 py-2 text-sm shadow-sm ${
                      isBot
                        ? "mr-auto rounded-tl-none bg-white text-[#111b21]"
                        : "ml-auto rounded-tr-none bg-[#d9fdd3] text-[#111b21]"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-[#667781]">
                      <span>{message.time}</span>
                      {!isBot ? (
                        <CheckCheck className="size-3.5 text-[#53bdeb]" aria-label="Lida" />
                      ) : null}
                    </div>
                  </div>

                  {/* Botões interativos do WhatsApp (Estilo WhatsApp Business) */}
                  {message.buttons && message.buttons.length > 0 ? (
                    <div className="mr-auto grid w-full max-w-[84%] gap-1.5 pt-0.5">
                      {message.buttons.map((btnLabel) => (
                        <button
                          key={btnLabel}
                          type="button"
                          onClick={() => handleSend(btnLabel)}
                          className="flex items-center justify-center rounded-xl border border-emerald-600/30 bg-white px-3 py-2.5 text-center text-sm font-semibold text-[#008069] shadow-sm transition-all hover:bg-emerald-50 active:scale-[0.98]"
                        >
                          {btnLabel}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}

            {/* Indicador de Digitação */}
            {typing ? (
              <div className="mr-auto flex max-w-[84%] items-center gap-1.5 rounded-xl rounded-tl-none bg-white px-3 py-2 text-xs text-[#667781] shadow-sm">
                <span className="size-2 animate-bounce rounded-full bg-emerald-600" />
                <span className="size-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:0.2s]" />
                <span className="size-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:0.4s]" />
                <span className="ml-1 italic">digitando…</span>
              </div>
            ) : null}

            <div ref={chatBottomRef} />
          </div>

          {/* Barra de Entrada de Mensagem do WhatsApp */}
          <footer className="flex items-center gap-2 bg-[#f0f2f5] px-2 py-2">
            <div className="flex flex-1 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
              <button
                type="button"
                className="text-[#54656f] hover:text-[#111b21]"
                onClick={() => setDraft((prev) => prev + " 😊")}
              >
                <Smile className="size-5" />
              </button>
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend(draft);
                  }
                }}
                placeholder="Mensagem"
                className="w-full bg-transparent text-sm text-[#111b21] placeholder-[#8696a0] focus:outline-none"
              />
              <button
                type="button"
                className="text-[#54656f] hover:text-[#111b21]"
                onClick={() => toast.info("Envio de mídia simulado.")}
              >
                <Paperclip className="size-5 rotate-45" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleSend(draft)}
              disabled={!draft.trim() || typing}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#008069] text-white shadow-md transition-transform hover:bg-[#00705c] active:scale-95 disabled:opacity-50"
              aria-label="Enviar"
            >
              <Send className="size-4" />
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
