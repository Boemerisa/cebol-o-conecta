import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { NEIGHBORHOODS, SEED_PRODUCTS } from "@/lib/catalog";
import { matchNeighborhood, parseOrderText, sum } from "@/lib/parser";

/**
 * Webhook pronto para provedores de WhatsApp (Evolution API, Z-API, Baileys).
 * Recebe a mensagem do cliente, devolve os itens reconhecidos e os totais.
 * Antes de ir para produção: valide o token/assinatura do provedor e grave
 * os pedidos no banco (Lovable Cloud) em vez de responder apenas o cálculo.
 */
const payloadSchema = z.object({
  phone: z.string().min(5).max(30),
  message: z.string().min(1).max(2000),
  neighborhood: z.string().max(80).optional(),
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export const Route = createFileRoute("/api/public/whatsapp")({
  server: {
    handlers: {
      GET: async () =>
        json({
          ok: true,
          service: "Cebolão — assistente de pedidos",
          usage: "POST { phone, message, neighborhood? }",
        }),
      POST: async ({ request }) => {
        const token = process.env["WHATSAPP_WEBHOOK_TOKEN"];
        if (token && request.headers.get("x-webhook-token") !== token) {
          return json({ error: "unauthorized" }, 401);
        }
        const body = await request.json().catch(() => null);
        const parsedBody = payloadSchema.safeParse(body);
        if (!parsedBody.success) return json({ error: "invalid_payload" }, 400);

        const { items, unknown, unavailable } = parseOrderText(
          parsedBody.data.message,
          SEED_PRODUCTS,
        );
        const subtotal = sum(items);
        const bairro = parsedBody.data.neighborhood
          ? matchNeighborhood(parsedBody.data.neighborhood, NEIGHBORHOODS)
          : null;
        const deliveryFee = bairro?.fee ?? 0;

        return json({
          phone: parsedBody.data.phone,
          itens: items.map((item) => ({
            produto: item.name,
            qtd: item.qty,
            unidade: item.unit,
            preco_unitario: item.unitPrice,
            total: item.total,
          })),
          nao_encontrados: unknown,
          esgotados: unavailable,
          subtotal,
          taxa_entrega: deliveryFee,
          bairro: bairro?.name ?? null,
          total: Math.round((subtotal + deliveryFee) * 100) / 100,
        });
      },
    },
  },
});