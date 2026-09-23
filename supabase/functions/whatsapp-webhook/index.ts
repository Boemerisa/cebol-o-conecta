// Supabase Edge Function: whatsapp-webhook
// Pronta para receber webhooks da Evolution API e Z-API
// Deploy: supabase functions deploy whatsapp-webhook --no-verify-jwt

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExtractedIncoming {
  phone: string;
  text: string;
  senderName?: string;
  isFromMe?: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function extractIncoming(body: any): ExtractedIncoming | null {
  if (!body || typeof body !== "object") return null;

  // 1. Evolution API (v1 / v2)
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

  // 3. Payload Genérico
  if (body.phone && (body.message || body.text)) {
    return {
      phone: String(body.phone).replace(/\D/g, ""),
      text: String(body.message || body.text).trim(),
      isFromMe: false,
    };
  }

  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method === "GET") {
    return new Response(
      JSON.stringify({
        status: "ok",
        service: "Cebolão Empório e Verdurão — Edge Function WhatsApp Webhook",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => null);
    const incoming = extractIncoming(body);

    if (!incoming || incoming.isFromMe) {
      return new Response(JSON.stringify({ ok: true, ignored: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!incoming.phone || !incoming.text) {
      return new Response(
        JSON.stringify({ error: "missing_phone_or_text" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Carrega a sessão da conversa
    const { data: sessionData } = await supabase
      .from("whatsapp_sessions")
      .select("state")
      .eq("phone", incoming.phone)
      .maybeSingle();

    const currentState = sessionData?.state ?? { step: "start" };
    const n = incoming.text.toLowerCase().trim();

    // Se o cliente solicitou atendimento humano
    if (n.includes("atendente") || n.includes("humano")) {
      await supabase.from("support_requests").insert({
        customer_phone: incoming.phone,
        message: "Cliente solicitou atendimento humano pelo WhatsApp",
        handled: false,
      });

      return new Response(
        JSON.stringify({
          ok: true,
          action: "human",
          reply: "Tudo bem! Já avisei a dona da loja aqui no balcão. Ela vai te responder em instantes. 😊🧅",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        phone: incoming.phone,
        message_received: incoming.text,
        session_state: currentState,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
