import { i as __toESM } from "./rolldown-runtime-D7D4PA-g.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as ArrowLeft, c as Send, l as RotateCcw, m as Paperclip, n as Video, o as Smile, p as Phone, w as CheckCheck, y as EllipsisVertical } from "../_libs/lucide-react.mjs";
import { _ as fetchProducts, a as initialBotState, c as totalOf, d as SUPPORT_KEY, f as createOrderFromBot, i as advance, l as ORDERS_KEY, m as createSupportRequest, n as WELCOME_BUTTONS, o as subtotalOf, r as WELCOME_TEXT, s as summaryText, u as PRODUCTS_KEY } from "./router-B08l5_3y.mjs";
import { t as Button } from "./button-B3D86jL6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/simulador-CycVXKdj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CLIENT_PHONE = "(62) 99988-7766";
var INACTIVITY_TIMEOUT_MS = 18e5;
var now = () => (/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR", {
	hour: "2-digit",
	minute: "2-digit"
});
var seq = 0;
var nextId = () => `msg_${Date.now()}_${++seq}`;
function welcomeMessage() {
	return {
		id: nextId(),
		from: "bot",
		text: WELCOME_TEXT,
		buttons: WELCOME_BUTTONS,
		time: now()
	};
}
function SimuladorPage() {
	const queryClient = useQueryClient();
	const { data: products = [] } = useQuery({
		queryKey: PRODUCTS_KEY,
		queryFn: fetchProducts
	});
	const [messages, setMessages] = (0, import_react.useState)(() => [welcomeMessage()]);
	const [state, setState] = (0, import_react.useState)(initialBotState);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [typing, setTyping] = (0, import_react.useState)(false);
	const [isWithHuman, setIsWithHuman] = (0, import_react.useState)(false);
	const [hasStarted, setHasStarted] = (0, import_react.useState)(false);
	const [lastActivity, setLastActivity] = (0, import_react.useState)(Date.now());
	const chatBottomRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		chatBottomRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end"
		});
	}, [messages, typing]);
	(0, import_react.useEffect)(() => {
		if (!hasStarted) return;
		const timer = setTimeout(() => {
			setIsWithHuman(false);
			setHasStarted(false);
			setState(initialBotState());
			setMessages((prev) => [...prev, {
				id: nextId(),
				from: "bot",
				text: "Devido ao tempo de inatividade de 30 minutos, o atendimento foi encerrado automaticamente. Quando precisar de algo, basta enviar uma nova mensagem por aqui! 😊👋",
				buttons: WELCOME_BUTTONS,
				time: now()
			}]);
			toast.info("Atendimento encerrado por inatividade de 30 minutos.");
		}, INACTIVITY_TIMEOUT_MS);
		return () => clearTimeout(timer);
	}, [hasStarted, lastActivity]);
	const supportMutation = useMutation({
		mutationFn: (clientMessage) => createSupportRequest(CLIENT_PHONE, clientMessage),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: SUPPORT_KEY });
			setIsWithHuman(true);
			setLastActivity(Date.now());
			toast.info("Aviso enviado ao painel da loja: cliente na lista 'Conversas Pendentes'.", { duration: 4e3 });
		},
		onError: () => {
			toast.error("Erro ao registrar atendimento humano.");
		}
	});
	const orderMutation = useMutation({
		mutationFn: (finishedState) => createOrderFromBot({
			customerPhone: CLIENT_PHONE,
			items: finishedState.items,
			subtotal: subtotalOf(finishedState),
			deliveryFee: 5,
			total: totalOf(finishedState),
			payment: {
				method: finishedState.payment ?? "pix",
				cashFor: finishedState.cashFor
			},
			address: finishedState.address,
			source: "whatsapp"
		}),
		onSuccess: (orderNumber, finishedState) => {
			queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
			pushBotReplies([{
				text: `${summaryText(finishedState, orderNumber)}\n\n🛵 *Seu pedido já caiu na tela de separação da loja!* Avisaremos quando sair para entrega.`,
				buttons: ["Finalizar"]
			}]);
			toast.success(`Pedido ${orderNumber} gravado com sucesso no Supabase!`, { duration: 5e3 });
		},
		onError: (err) => {
			toast.error(`Erro ao salvar pedido: ${err.message}`);
			pushBotReplies([{
				text: `Ops! Ocorreu um problema ao registrar seu pedido: ${err.message}. A dona da loja já foi avisada.`,
				buttons: ["Finalizar"]
			}]);
		}
	});
	function pushBotReplies(replies) {
		setMessages((prev) => [...prev, ...replies.map((reply) => ({
			id: nextId(),
			from: "bot",
			text: reply.text,
			...reply.buttons ? { buttons: reply.buttons } : {},
			time: now()
		}))]);
	}
	function handleSend(textToSend) {
		const clean = textToSend.trim();
		if (!clean || typing) return;
		setDraft("");
		setHasStarted(true);
		setLastActivity(Date.now());
		if (clean.toLowerCase() === "finalizar") {
			setIsWithHuman(false);
			setHasStarted(false);
			setState(initialBotState());
			setMessages((prev) => [...prev, {
				id: nextId(),
				from: "client",
				text: clean,
				time: now()
			}]);
			setTyping(true);
			window.setTimeout(() => {
				setTyping(false);
				pushBotReplies([{
					text: "Ficamos muito felizes em te atender! Agradecemos a preferência e volte sempre! 😊👋",
					buttons: WELCOME_BUTTONS
				}]);
			}, 500);
			return;
		}
		setMessages((prev) => [...prev, {
			id: nextId(),
			from: "client",
			text: clean,
			time: now()
		}]);
		setTyping(true);
		const result = advance(state, clean, products);
		setState(result.state);
		window.setTimeout(() => {
			setTyping(false);
			if (result.action === "human") {
				pushBotReplies([...result.replies, {
					text: "Um atendente responderá em breve. Caso deseje encerrar, basta clicar no botão abaixo.",
					buttons: ["Finalizar"]
				}]);
				supportMutation.mutate(clean);
			} else pushBotReplies(result.replies);
			if (result.action === "create_order") orderMutation.mutate(result.state);
		}, 600);
	}
	function handleRestart() {
		setIsWithHuman(false);
		setHasStarted(false);
		setState(initialBotState());
		setMessages([welcomeMessage()]);
		setDraft("");
		setTyping(false);
		toast.info("Conversa reiniciada. O bot enviou a saudação inicial.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-lg flex-col items-center pb-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex w-full items-center justify-between px-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-black text-foreground",
				children: "Simulador WhatsApp"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Interaja exatamente como um cliente pelo celular"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: handleRestart,
				className: "gap-2 border-emerald-600/40 text-emerald-800 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
					className: "size-4 text-emerald-600",
					"aria-hidden": true
				}), "Reiniciar Conversa / Novo Teste"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full overflow-hidden rounded-[2.5rem] border-[8px] border-neutral-800 bg-neutral-900 shadow-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex h-6 w-full items-center justify-center bg-neutral-800",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 w-24 rounded-full bg-neutral-900" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-[680px] flex-col bg-[#efeae2]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex items-center gap-2 bg-[#008069] px-3 py-2.5 text-white shadow-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleRestart,
								className: "rounded-full p-1 transition-colors hover:bg-white/10",
								title: "Voltar / Reiniciar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-2xl shadow-inner",
								children: ["🧅", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#008069] bg-green-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "truncate text-base font-bold leading-tight",
									children: "Cebolão Empório e Verdurão"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-emerald-100",
									children: isWithHuman ? "atendimento humano" : "online"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-emerald-100",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "hover:text-white",
										onClick: () => toast.info("Ligação por voz não disponível no simulador."),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "hover:text-white",
										onClick: () => toast.info("Ligação de áudio não disponível no simulador."),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "hover:text-white",
										onClick: () => toast.info("Opções do WhatsApp"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "size-5" })
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 space-y-3 overflow-y-auto p-3",
						style: {
							backgroundImage: `radial-gradient(#d3c9be 1px, transparent 1px)`,
							backgroundSize: "20px 20px"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto my-1 max-w-[85%] rounded-lg bg-[#ffeecd] px-3 py-1.5 text-center text-[11px] leading-tight text-[#54656f] shadow-sm",
								children: "🔒 As mensagens são protegidas com criptografia de ponta a ponta."
							}),
							messages.map((message) => {
								const isBot = message.from === "bot";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `relative max-w-[84%] rounded-xl px-3.5 py-2 text-sm shadow-sm ${isBot ? "mr-auto rounded-tl-none bg-white text-[#111b21]" : "ml-auto rounded-tr-none bg-[#d9fdd3] text-[#111b21]"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "whitespace-pre-wrap leading-relaxed",
											children: message.text
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 flex items-center justify-end gap-1 text-[10px] text-[#667781]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: message.time }), !isBot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, {
												className: "size-3.5 text-[#53bdeb]",
												"aria-label": "Lida"
											}) : null]
										})]
									}), message.buttons && message.buttons.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mr-auto grid w-full max-w-[84%] gap-1.5 pt-0.5",
										children: message.buttons.map((btnLabel) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleSend(btnLabel),
											className: "flex items-center justify-center rounded-xl border border-emerald-600/30 bg-white px-3 py-2.5 text-center text-sm font-semibold text-[#008069] shadow-sm transition-all hover:bg-emerald-50 active:scale-[0.98]",
											children: btnLabel
										}, btnLabel))
									}) : null]
								}, message.id);
							}),
							typing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mr-auto flex max-w-[84%] items-center gap-1.5 rounded-xl rounded-tl-none bg-white px-3 py-2 text-xs text-[#667781] shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 animate-bounce rounded-full bg-emerald-600" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:0.2s]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:0.4s]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-1 italic",
										children: "digitando…"
									})
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: chatBottomRef })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "flex items-center gap-2 bg-[#f0f2f5] px-2 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-1 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-[#54656f] hover:text-[#111b21]",
									onClick: () => setDraft((prev) => prev + " 😊"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: draft,
									onChange: (e) => setDraft(e.target.value),
									onKeyDown: (e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleSend(draft);
										}
									},
									placeholder: "Mensagem",
									className: "w-full bg-transparent text-sm text-[#111b21] placeholder-[#8696a0] focus:outline-none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-[#54656f] hover:text-[#111b21]",
									onClick: () => toast.info("Envio de mídia simulado."),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-5 rotate-45" })
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => handleSend(draft),
							disabled: !draft.trim() || typing,
							className: "flex size-10 shrink-0 items-center justify-center rounded-full bg-[#008069] text-white shadow-md transition-transform hover:bg-[#00705c] active:scale-95 disabled:opacity-50",
							"aria-label": "Enviar",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { SimuladorPage as component };
