import { createFileRoute } from "@tanstack/react-router";

import { WhatsAppSimulator } from "@/components/whatsapp-simulator";

export const Route = createFileRoute("/simulador")({
  head: () => ({
    meta: [
      { title: "Simulador de WhatsApp | Cebolão" },
      {
        name: "description",
        content:
          "Teste a conversa do assistente de pedidos, veja o JSON gerado e o pedido caindo no painel da loja.",
      },
      { property: "og:title", content: "Simulador de WhatsApp | Cebolão" },
      {
        property: "og:description",
        content: "Converse como cliente e acompanhe o pedido sendo montado em tempo real.",
      },
    ],
  }),
  component: SimuladorPage,
});

function SimuladorPage() {
  return (
    <div className="space-y-4 pb-24">
      <header className="space-y-1">
        <h1 className="text-2xl font-extrabold">Simulador de atendimento</h1>
        <p className="text-sm text-muted-foreground">
          Escreva como o cliente escreveria. Ex.: <em>1kg de tomate, 2 pés de alface, 1 óleo Liza e
          500g de cebola</em>
        </p>
      </header>
      <WhatsAppSimulator />
    </div>
  );
}