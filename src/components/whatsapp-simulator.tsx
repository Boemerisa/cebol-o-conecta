import { RotateCcw, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NEIGHBORHOODS, PIX_KEY, STORE_NAME } from "@/lib/catalog";
import { brl, qtyLabel } from "@/lib/format";
import { matchNeighborhood, parseOrderText, sum } from "@/lib/parser";
import { addOrder, nextOrderNumber, useStore } from "@/lib/store";
import type { Address, OrderItem, PaymentMethod, Product } from "@/lib/types";

type Step =
  | "items"
  | "confirm_items"
  | "neighborhood"
  | "street"
  | "extra"
  | "receiver"
  | "payment"
  | "cash"
  | "confirm"
  | "done";

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
}

const GREETING = `Oi! 😊 Aqui é o *${STORE_NAME}* — hortifruti fresquinho e mercearia com entrega no bairro.\n\nMe manda tudo que você precisa (pode ser em lista ou por áudio!). Ex.: _1kg de tomate, 2 pés de alface, 1 óleo Liza e 500g de cebola_`;

function itemsSummary(items: OrderItem[]): string {
  return items
    .map((i) => `• ${qtyLabel(i.qty, i.unit)} ${i.name} — ${brl(i.total)}`)
    .join("\n");
}

const emptyAddress: Address = {
  street: "",
  number: "",
  neighborhood: "",
  complement: "",
  reference: "",
  receiver: "",
};

export function WhatsAppSimulator() {
  const products = useStore((s) => s.products);
  const [messages, setMessages] = useState<Message[]>([{ id: 0, from: "bot", text: GREETING }]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<Step>("items");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [fee, setFee] = useState(0);
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [payment, setPayment] = useState<PaymentMethod | null>(null);
  const [cashFor, setCashFor] = useState<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const subtotal = sum(items);
  const total = Math.round((subtotal + fee) * 100) / 100;

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const draft = useMemo(
    () => ({
      pedido: nextOrderNumber(),
      itens: items.map((i) => ({
        produto: i.name,
        qtd: i.qty,
        unidade: i.unit,
        preco_unitario: i.unitPrice,
        total: i.total,
      })),
      subtotal,
      taxa_entrega: fee,
      total,
      pagamento: payment ? { forma: payment, dinheiro_para: cashFor } : null,
      endereco: address,
    }),
    [items, subtotal, fee, total, payment, cashFor, address],
  );

  function push(from: "bot" | "user", text: string) {
    setMessages((prev) => [...prev, { id: prev.length + Math.random(), from, text }]);
  }

  function reset() {
    setMessages([{ id: 0, from: "bot", text: GREETING }]);
    setStep("items");
    setItems([]);
    setFee(0);
    setAddress(emptyAddress);
    setPayment(null);
    setCashFor(null);
  }

  function handleItems(text: string, list: Product[], current: OrderItem[]) {
    const parsed = parseOrderText(text, list);
    if (parsed.items.length === 0) {
      push(
        "bot",
        "Não consegui identificar os produtos 🤔 Pode escrever assim: *1kg de tomate, 2 leites, 1 arroz 5kg*?",
      );
      return;
    }
    const merged = [...current];
    for (const item of parsed.items) {
      const found = merged.find((m) => m.productId === item.productId);
      if (found) {
        found.qty = Math.round((found.qty + item.qty) * 1000) / 1000;
        found.total = Math.round(found.qty * found.unitPrice * 100) / 100;
      } else merged.push(item);
    }
    setItems(merged);
    let reply = `Anotado! 📝\n\n${itemsSummary(merged)}\n\n*Itens: ${brl(sum(merged))}*`;
    if (parsed.unavailable.length) reply += `\n\n⚠️ Hoje está esgotado: ${parsed.unavailable.join(", ")}`;
    if (parsed.unknown.length)
      reply += `\n\n❓ Não encontrei: ${parsed.unknown.join(", ")} — quer tentar outro nome?`;
    reply += "\n\nÉ só isso ou quer add mais alguma coisa? (responda *só isso* ou mande os itens)";
    push("bot", reply);
    setStep("confirm_items");
  }

  function askNeighborhood() {
    push(
      "bot",
      `Perfeito! Qual o seu *bairro*? A entrega fica assim:\n${NEIGHBORHOODS.map(
        (n) => `• ${n.name} — ${brl(n.fee)}`,
      ).join("\n")}`,
    );
    setStep("neighborhood");
  }

  function send() {
    const text = input.trim();
    if (!text) return;
    push("user", text);
    setInput("");
    const lower = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (step === "items") {
      handleItems(text, products, items);
      return;
    }

    if (step === "confirm_items") {
      if (/(so isso|so|isso|nada mais|fechou|pode fechar|e isso|sim)\b/.test(lower)) {
        if (items.length === 0) {
          push("bot", "Sua sacola está vazia 🙈 Me diz o que você precisa!");
          setStep("items");
          return;
        }
        askNeighborhood();
      } else {
        handleItems(text, products, items);
      }
      return;
    }

    if (step === "neighborhood") {
      const match = matchNeighborhood(text, NEIGHBORHOODS);
      if (!match) {
        push("bot", "Não achei esse bairro 😕 Pode escolher um da lista acima?");
        return;
      }
      setFee(match.fee);
      setAddress((a) => ({ ...a, neighborhood: match.name }));
      push(
        "bot",
        `Entrega no ${match.name}: ${brl(match.fee)} 🛵\n\nAgora me passa a *rua e o número*. Ex.: _Rua das Palmeiras, 245_`,
      );
      setStep("street");
      return;
    }

    if (step === "street") {
      const numberMatch = text.match(/(\d+[a-zA-Z]?)\s*$/) ?? text.match(/,\s*(\d+[a-zA-Z]?)/);
      const num = numberMatch?.[1] ?? "s/n";
      const street = text.replace(/,?\s*\d+[a-zA-Z]?\s*$/, "").replace(/,$/, "").trim() || text;
      setAddress((a) => ({ ...a, street, number: num }));
      push(
        "bot",
        "Tem *complemento* (casa, apto, fundos) e algum *ponto de referência*? Se não tiver, escreva *não*.",
      );
      setStep("extra");
      return;
    }

    if (step === "extra") {
      if (!/^(nao|n)\b/.test(lower)) {
        const [complement, ...rest] = text.split(/[,-]/);
        setAddress((a) => ({
          ...a,
          complement: (complement ?? "").trim(),
          reference: rest.join(",").trim(),
        }));
      }
      push("bot", "E o *nome de quem vai receber* o pedido? 🙋");
      setStep("receiver");
      return;
    }

    if (step === "receiver") {
      setAddress((a) => ({ ...a, receiver: text }));
      push(
        "bot",
        `Total com entrega: *${brl(total)}* 💚\n\nComo prefere pagar?\n1️⃣ *PIX* (mando a chave copia e cola)\n2️⃣ *Cartão na entrega* (crédito/débito na maquininha)\n3️⃣ *Dinheiro*`,
      );
      setStep("payment");
      return;
    }

    if (step === "payment") {
      if (/pix|^1/.test(lower)) {
        setPayment("pix");
        push(
          "bot",
          `PIX anotado ✅\nChave copia e cola:\n\`${PIX_KEY}\`\nValor: *${brl(total)}*\n\nConfirma o pedido? (responda *confirmar*)`,
        );
        setStep("confirm");
        return;
      }
      if (/cartao|credito|debito|maquin|^2/.test(lower)) {
        setPayment("card");
        push(
          "bot",
          "Cartão na entrega ✅ Vou avisar o motoboy para levar a maquininha.\n\nConfirma o pedido? (responda *confirmar*)",
        );
        setStep("confirm");
        return;
      }
      if (/dinheiro|especie|^3/.test(lower)) {
        setPayment("cash");
        push("bot", `Dinheiro ✅ *Precisa de troco para quanto?* (total ${brl(total)})`);
        setStep("cash");
        return;
      }
      push("bot", "Só pra confirmar: *PIX*, *cartão na entrega* ou *dinheiro*?");
      return;
    }

    if (step === "cash") {
      const value = parseFloat((lower.match(/\d+([.,]\d+)?/)?.[0] ?? "").replace(",", "."));
      if (/nao preciso|sem troco|valor exato|exato/.test(lower)) {
        setCashFor(total);
        push("bot", "Sem troco, valor exato ✅\n\nConfirma o pedido? (responda *confirmar*)");
        setStep("confirm");
        return;
      }
      if (!value || Number.isNaN(value)) {
        push("bot", `Me diz o valor da nota, por exemplo *50*. O total é ${brl(total)}.`);
        return;
      }
      if (value < total) {
        push("bot", `O total é ${brl(total)}, então preciso de uma nota igual ou maior 🙂`);
        return;
      }
      setCashFor(value);
      push(
        "bot",
        `Troco de *${brl(Math.round((value - total) * 100) / 100)}* para a nota de ${brl(value)} ✅\n\nConfirma o pedido? (responda *confirmar*)`,
      );
      setStep("confirm");
      return;
    }

    if (step === "confirm") {
      if (!/confirm|sim|isso|fechado|ok/.test(lower)) {
        push("bot", "Sem problema! Quer mudar algo? Pode me mandar os itens novamente.");
        setStep("items");
        return;
      }
      if (!payment) return;
      const order = addOrder({
        customerPhone: "(11) 98888-1234",
        items,
        subtotal,
        deliveryFee: fee,
        total,
        payment: {
          method: payment,
          ...(payment === "cash" && cashFor != null
            ? { cashFor, change: Math.round((cashFor - total) * 100) / 100 }
            : {}),
        },
        address,
        source: "simulador",
      });
      push(
        "bot",
        `🧾 *Pedido ${order.number} confirmado!*\n\n${itemsSummary(items)}\n\nItens: ${brl(subtotal)}\nEntrega: ${brl(fee)}\n*Total: ${brl(total)}*\n\n📍 ${address.street}, ${address.number} — ${address.neighborhood}\nRecebe: ${address.receiver}\n\nJá estamos separando tudo fresquinho. Obrigada! 💚`,
      );
      setStep("done");
      toast.success(`Pedido ${order.number} caiu no painel da loja!`);
      return;
    }

    push("bot", "Quer fazer um novo pedido? Toque em *Nova conversa* 😊");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3 bg-primary-strong px-4 py-3 text-primary-foreground">
          <div className="grid size-10 place-items-center rounded-full bg-primary text-lg font-bold">
            🧅
          </div>
          <div>
            <p className="font-semibold leading-tight">{STORE_NAME}</p>
            <p className="text-xs opacity-80">online • responde na hora</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-primary-foreground hover:bg-primary/40"
            onClick={reset}
          >
            <RotateCcw aria-hidden /> Nova conversa
          </Button>
        </div>
        <div ref={scroller} className="h-[60vh] space-y-2 overflow-y-auto bg-whatsapp-bg p-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={m.from === "bot" ? "flex justify-start" : "flex justify-end"}
            >
              <p
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  m.from === "bot"
                    ? "rounded-tl-sm bg-bubble-in text-foreground"
                    : "rounded-tr-sm bg-bubble-out text-foreground"
                }`}
              >
                {m.text.split("*").map((part, index) =>
                  index % 2 === 1 ? (
                    <strong key={index}>{part}</strong>
                  ) : (
                    <span key={index}>{part}</span>
                  ),
                )}
              </p>
            </div>
          ))}
        </div>
        <form
          className="flex items-center gap-2 border-t border-border bg-card p-3"
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Digite como se fosse o cliente…"
            className="h-12 rounded-full"
            aria-label="Mensagem do cliente"
          />
          <Button type="submit" variant="hero" size="icon" className="size-12 rounded-full">
            <Send aria-hidden />
          </Button>
        </form>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-bold">Resumo em tempo real</p>
          <p className="mt-2 text-3xl font-extrabold text-primary-strong">{brl(total)}</p>
          <p className="text-sm text-muted-foreground">
            {items.length} item(ns) • entrega {brl(fee)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-bold">JSON do pedido (para a API do WhatsApp)</p>
          <pre className="mt-2 max-h-80 overflow-auto rounded-lg bg-muted p-3 text-xs">
            {JSON.stringify(draft, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}