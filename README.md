# Cebolão Conecta

Crie uma aplicação web responsiva (Mobile-First) e um assistente de pedidos para WhatsApp para uma mercearia e verdurão de bairro chamada "Cebolão Empório e Verdurão". A dona do comércio atende tudo manualmente no papel, usa calculadora física e não tem computadores. O objetivo do sistema é eliminar erros de pedidos esquecidos, cálculos incorretos de valores e falhas na cobrança/troco para o entregador. ### 1. Filosofia de Design e Usabilidade - **Interface do Cliente (Simulador do Bot WhatsApp):** Fluxo de conversa humanizado, simples e direto, focado em extrair itens, quantidades (kg, unidade, pacote), endereço e forma de pagamento. - **Painel da Dona (Painel do Comerciante):** Interface para celular, botões grandes, alto contraste, sem termos técnicos, fácil de usar atrás do balcão com poucos toques. ### 2. Módulos e Funcionalidades Principais #### A. Fluxo de Atendimento e Extração do Pedido (IA / Regras) 1. **Boas-vindas:** Mensagem calorosa em nome do "Cebolão Empório e Verdurão". 2. **Coleta de Itens:** Aceita texto corrido, listas ou áudio simulado (ex: "1kg de tomate, 2 pés de alface, 1 óleo de soja Liza e 500g de cebola"). 3. **Cálculo Automático:** Identifica os produtos no catálogo, calcula o subtotal e soma a taxa de entrega por bairro/distância. 4. **Forma de Pagamento:** Opções claras: Pix (com chave Copia e Cola), Cartão na Entrega (Crédito/Débito - avisar maquininha ao motoboy) ou Dinheiro (com pergunta obrigatória: "Precisa de troco para quanto?"). 5. **Endereço Completo:** Coleta Rua, Número, Bairro, Complemento, Ponto de Referência e Nome de quem recebe. 6. **Confirmação e Recibo:** Gera um resumo final numerado (#001) para confirmação do cliente antes de enviar à cozinha/separação. #### B. Painel de Controle de Pedidos (Para a Dona da Loja) - **Quadro de Pedidos (Kanban Simples):** Colunas com status claros: "Novo Pedido" (com alerta sonoro e visual), "Em Separação", "Saiu para Entrega", "Finalizado". - **Comanda Digital / Impressão:** - Layout pronto para impressão térmica (58mm/80mm) ou print de tela no celular. - Checklist com caixas de seleção (checkbox) para ela marcar os itens físicos enquanto separa. - Destaque em vermelho/amarelo para: FORMA DE PAGAMENTO e VALOR DO TROCO (ex: "LEVAR TROCO DE R$ 23,50 PARA NOTA DE R$ 50,00"). - **Catálogo de Preços Rápido:** - Cadastro simples com categorias: Hortifruti (preço por kg/un), Mercearia, Laticínios e Frios, Bebidas, Limpeza. - Botão rápido de "Disponível / Esgotado". #### C. Simulador de WhatsApp Integrado - Adicione uma aba na interface com um simulador visual de WhatsApp para testar a conversa em tempo real, ver o JSON do pedido sendo gerado e verificar o pedido caindo instantaneamente no painel da loja. - Deixe o backend (Supabase/Node) preparado com endpoints/webhooks para conectar com APIs de WhatsApp (como Evolution API, Z-API ou Baileys). ### 3. Identidade Visual e Stack - Cores: Verde hortifruti (`#16a34a`), toques em tons terrosos suaves e fundo claro e limpo. - Ícones: Biblioteca Lucide-react para identificação visual clara (WhatsApp, Sacola, Impressora, Dinheiro, Alerta). - Inclua dados mockados iniciais com cerca de 20 produtos clássicos de mercearia e verdurão (banana, tomate, batata, cebola, arroz, feijão, leite, óleo, etc.) para testar os totais de imediato.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0ee20bf1-d3cb-42bd-98ce-a3e15c234ffa).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
