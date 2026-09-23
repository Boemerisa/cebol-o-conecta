import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  DELIVERY_FEE,
  advance,
  initialBotState,
  subtotalOf,
  summaryText,
  totalOf,
  type BotState,
} from "@/lib/bot";
import { createOrderFromBot, createSupportRequest, fetchProducts } from "@/lib/data";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

interface ExtractedIncoming {
  phone: string;
  text: string;
  senderName?: string;
  isFromMe?: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function extractIncoming(body: any): ExtractedIncoming | null {
  if (!body || typeof body !== "object") return null;

  // 1. Evolution API (v1 e v2)
  if (body.data && body.data.key) {
    const key = body.data.key;
    if (key.fromMe) return { phone: "", text: "", isFromMe: true };
    const remoteJid = key.remoteJid || "";
    const phone = remoteJid.replace(/@.*$/, "").replace(/\D/g, "");
    const msg = body.data.message || {};
    const text =
      msg.conversation ||
      msg.extendedTextMessage?.text ||
      msg.buttonsResponseMessage?.selectedDisplayText ||
      msg.buttonsResponseMessage?.selectedButtonId ||
      msg.templateButtonReplyMessage?.selectedDisplayText ||
      msg.templateButtonReplyMessage?.selectedId ||
      msg.listResponseMessage?.title ||
      msg.listResponseMessage?.singleSelectReply?.selectedRowId ||
      "";
    return {
      phone,
      text: String(text).trim(),
      senderName: body.data.pushName,
      isFromMe: false,
    };
  }

  // 2. Z-API
  if (body.phone && (body.text || body.buttonResponse || body.messageId)) {
    if (body.fromMe) return { phone: "", text: "", isFromMe: true };
    const phone = String(body.phone).replace(/\D/g, "");
    const text =
      body.text?.message ||
      body.buttonResponse?.buttonText ||
      body.buttonResponse?.buttonId ||
      body.message ||
      "";
    return {
      phone,
      text: String(text).trim(),
      senderName: body.senderName,
      isFromMe: false,
    };
  }

  // 3. Payload Genérico / Testes
  if (body.phone && (body.message || body.text)) {
    return {
      phone: String(body.phone).replace(/\D/g, ""),
      text: String(body.message || body.text).trim(),
      isFromMe: false,
    };
  }

  return null;
}

export const Route = createFileRoute("/api/public/whatsapp")({
  server: {
    handlers: {
      GET: async () =>
        json({
          ok: true,
          service: "Cebolão Empório e Verdurão — Webhook de WhatsApp",
          supported_apis: ["Evolution API", "Z-API", "Custom POST"],
          usage: "POST payload do webhook do WhatsApp para processar e atualizar o Supabase",
        }),

      POST: async ({ request }) => {
        // Validação opcional de token
        const token = process.env["WHATSAPP_WEBHOOK_TOKEN"];
        if (token && request.headers.get("x-webhook-token") !== token) {
          return json({ error: "unauthorized" }, 401);
        }

        const body = await request.json().catch(() => null);
        const incoming = extractIncoming(body);

        if (!incoming || incoming.isFromMe) {
          return json({ ok: true, ignored: true });
        }

        if (!incoming.phone || !incoming.text) {
          return json({ error: "missing_phone_or_text" }, 400);
        }

        // 1. Carrega produtos ativos do catálogo
        const products = await fetchProducts();

        // 2. Recupera a sessão atual da conversa do cliente no Supabase
        const { data: sessionData } = await supabase
          .from("whatsapp_sessions")
          .select("state")
          .eq("phone", incoming.phone)
          .maybeSingle();

        const currentState: BotState = sessionData?.state
          ? (sessionData.state as unknown as BotState)
          : initialBotState();

        // 3. Executa a máquina de estados do assistente
        const result = advance(currentState, incoming.text, products);

        // 4. Salva a nova sessão no Supabase
        await supabase.from("whatsapp_sessions").upsert({
          phone: incoming.phone,
          state: result.state as unknown as any,
          updated_at: new Date().toISOString(),
        });

        let orderNumber: string | undefined;

        // 5. Se o cliente pediu atendimento humano, registra em Conversas Pendentes
        if (result.action === "human") {
          await createSupportRequest(incoming.phone);
        }

        // 6. Se o pedido foi concluído, insere nas tabelas orders e order_items
        if (result.action === "create_order") {
          orderNumber = await createOrderFromBot({
            customerPhone: incoming.phone,
            items: result.state.items,
            subtotal: subtotalOf(result.state),
            deliveryFee: DELIVERY_FEE,
            total: totalOf(result.state),
            payment: {
              method: result.state.payment ?? "pix",
              cashFor: result.state.cashFor,
            },
            address: result.state.address,
            source: "whatsapp",
          });

          result.replies.push({
            text: `${summaryText(result.state, orderNumber)}\n\n🛵 *Seu pedido já caiu na tela de separação da loja!* Muito obrigado pela preferência! 🧅💚`,
          });
        }

        return json({
          ok: true,
          phone: incoming.phone,
          action: result.action ?? null,
          order_number: orderNumber ?? null,
          replies: result.replies,
        });
      },
    },
  },
});