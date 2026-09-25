import { i as __toESM } from "./rolldown-runtime-D7D4PA-g.mjs";
import { t as supabase } from "./client-p1aOg0Wm.mjs";
import { m as require_react, n as CheckboxIndicator, p as require_jsx_runtime, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Check, E as Banknote, S as ChevronRight, T as Bell, _ as Headset, b as CreditCard, d as Printer, h as PackageCheck, r as Truck, t as X, u as QrCode, v as ExternalLink, x as ClipboardList } from "../_libs/lucide-react.mjs";
import { D as qtyLabel, E as brl, T as STORE_NAME, b as updateChecked, d as SUPPORT_KEY, g as fetchOrders, l as ORDERS_KEY, v as fetchSupportRequests, w as PIX_KEY, x as updateOrderStatus, y as resolveSupportRequest } from "./router-B08l5_3y.mjs";
import { n as cn, t as Button } from "./button-B3D86jL6.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-adVKUSg0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var PAYMENT_LABEL = {
	pix: "PIX",
	card: "CARTÃO NA ENTREGA",
	cash: "DINHEIRO"
};
function PaymentBanner({ order }) {
	const method = order.payment.method;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: method === "cash" ? "rounded-lg border-2 border-destructive bg-destructive/10 p-3" : "rounded-lg border-2 border-warning bg-warning/20 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-center gap-2 text-base font-extrabold uppercase tracking-wide",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(method === "cash" ? Banknote : method === "card" ? CreditCard : QrCode, {
					className: "size-5",
					"aria-hidden": true
				}), PAYMENT_LABEL[method]]
			}),
			method === "cash" && order.payment.cashFor ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-lg font-extrabold uppercase text-destructive",
				children: [
					"Levar troco de ",
					brl(order.payment.change ?? 0),
					" para nota de ",
					brl(order.payment.cashFor)
				]
			}) : null,
			method === "card" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm font-bold uppercase",
				children: "Avisar o motoboy: levar a maquininha"
			}) : null,
			method === "pix" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm font-bold",
				children: ["Chave PIX: ", PIX_KEY]
			}) : null
		]
	});
}
function OrderTicket({ order, onToggleItem }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "no-print space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-muted-foreground",
						children: "Separação — marque cada item"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-2",
						children: order.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 rounded-md bg-muted/60 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								id: `${order.id}-${item.name}`,
								checked: order.checked.includes(item.name),
								onCheckedChange: () => onToggleItem(item.name),
								className: "size-6"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								htmlFor: `${order.id}-${item.name}`,
								className: "flex flex-1 items-baseline justify-between gap-2 text-base font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									qtyLabel(item.qty, item.unit),
									" — ",
									item.name
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: brl(item.total)
								})]
							})]
						}, item.name))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentBanner, { order }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card p-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold",
							children: "Entrega"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							order.address.street,
							order.address.number ? `, ${order.address.number}` : "",
							order.address.neighborhood ? ` — ${order.address.neighborhood}` : ""
						] }),
						order.address.complement ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Compl.: ", order.address.complement] }) : null,
						order.address.reference ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Ref.: ", order.address.reference] }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Recebe: ", order.address.receiver] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2",
							children: [
								"Itens ",
								brl(order.subtotal),
								" + entrega ",
								brl(order.deliveryFee),
								" =",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-lg",
									children: brl(order.total)
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "hero",
					size: "xl",
					className: "w-full",
					onClick: () => window.print(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {
						className: "size-5",
						"aria-hidden": true
					}), " Imprimir comanda"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThermalReceipt, { order })]
	});
}
function ThermalReceipt({ order }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "print-area mx-auto hidden max-w-[80mm] font-mono text-[12px] leading-tight",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center font-bold uppercase",
				children: STORE_NAME
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-center",
				children: ["Comanda ", order.number]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center",
				children: new Date(order.createdAt).toLocaleString("pt-BR")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "--------------------------------" }),
			order.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"[ ] ",
				qtyLabel(item.qty, item.unit),
				" ",
				item.name,
				" .... ",
				brl(item.total)
			] }, item.name)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "--------------------------------" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Itens: ", brl(order.subtotal)] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Entrega: ", brl(order.deliveryFee)] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-bold",
				children: ["TOTAL: ", brl(order.total)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "--------------------------------" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-bold uppercase",
				children: ["PAGTO: ", PAYMENT_LABEL[order.payment.method]]
			}),
			order.payment.method === "cash" && order.payment.cashFor ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-bold uppercase",
				children: [
					"LEVAR TROCO DE ",
					brl(order.payment.change ?? 0),
					" PARA NOTA DE ",
					brl(order.payment.cashFor)
				]
			}) : null,
			order.payment.method === "card" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-bold",
				children: "LEVAR MAQUININHA"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "--------------------------------" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [order.address.street, order.address.number ? `, ${order.address.number}` : ""] }),
			order.address.neighborhood ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.address.neighborhood }) : null,
			order.address.complement ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Compl: ", order.address.complement] }) : null,
			order.address.reference ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Ref: ", order.address.reference] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Recebe: ", order.address.receiver] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Tel: ", order.customerPhone] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-center",
				children: "Obrigada pela preferência!"
			})
		]
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var COLUMNS = [
	{
		status: "novo",
		label: "Novo pedido",
		next: "separacao",
		nextLabel: "Começar separação"
	},
	{
		status: "separacao",
		label: "Em separação",
		next: "entrega",
		nextLabel: "Saiu para entrega"
	},
	{
		status: "entrega",
		label: "Saiu para entrega",
		next: "finalizado",
		nextLabel: "Finalizar"
	},
	{
		status: "finalizado",
		label: "Finalizado"
	}
];
var ICONS = {
	novo: Bell,
	separacao: ClipboardList,
	entrega: Truck,
	finalizado: PackageCheck
};
function Painel() {
	const queryClient = useQueryClient();
	const { data: orders = [], isLoading } = useQuery({
		queryKey: ORDERS_KEY,
		queryFn: fetchOrders,
		refetchInterval: 12e3
	});
	const { data: supportRequests = [] } = useQuery({
		queryKey: SUPPORT_KEY,
		queryFn: fetchSupportRequests,
		refetchInterval: 1e4
	});
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [supportOpen, setSupportOpen] = (0, import_react.useState)(false);
	const previousNew = (0, import_react.useRef)(null);
	const previousSupportCount = (0, import_react.useRef)(null);
	const [alert, setAlert] = (0, import_react.useState)(false);
	const invalidateOrders = () => queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
	const invalidateSupport = () => queryClient.invalidateQueries({ queryKey: SUPPORT_KEY });
	(0, import_react.useEffect)(() => {
		try {
			const channel = supabase.channel("realtime_orders_and_support").on("postgres_changes", {
				event: "*",
				schema: "public",
				table: "orders"
			}, () => {
				invalidateOrders();
			}).on("postgres_changes", {
				event: "*",
				schema: "public",
				table: "support_requests"
			}, () => {
				invalidateSupport();
			}).subscribe();
			return () => {
				supabase.removeChannel(channel);
			};
		} catch {}
	}, []);
	const statusMutation = useMutation({
		mutationFn: ({ id, status }) => updateOrderStatus(id, status),
		onSuccess: invalidateOrders,
		onError: () => toast.error("Não deu para salvar. Tente de novo.")
	});
	const checkMutation = useMutation({
		mutationFn: ({ id, checked }) => updateChecked(id, checked),
		onSuccess: invalidateOrders,
		onError: () => toast.error("Não deu para salvar a marcação.")
	});
	const resolveMutation = useMutation({
		mutationFn: (id) => resolveSupportRequest(id),
		onSuccess: () => {
			invalidateSupport();
			toast.success("Atendimento marcado como resolvido!");
		},
		onError: () => toast.error("Erro ao atualizar o atendimento.")
	});
	const newCount = orders.filter((o) => o.status === "novo").length;
	(0, import_react.useEffect)(() => {
		if (previousNew.current != null && newCount > previousNew.current) {
			setAlert(true);
			try {
				const ctx = new AudioContext();
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.frequency.value = 880;
				gain.gain.value = .08;
				osc.connect(gain).connect(ctx.destination);
				osc.start();
				osc.stop(ctx.currentTime + .35);
			} catch {}
			const timer = setTimeout(() => setAlert(false), 4e3);
			previousNew.current = newCount;
			return () => clearTimeout(timer);
		}
		previousNew.current = newCount;
	}, [newCount]);
	(0, import_react.useEffect)(() => {
		const count = supportRequests.length;
		if (previousSupportCount.current != null && count > previousSupportCount.current) try {
			const ctx = new AudioContext();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.frequency.value = 660;
			gain.gain.value = .08;
			osc.connect(gain).connect(ctx.destination);
			osc.start();
			osc.stop(ctx.currentTime + .35);
		} catch {}
		previousSupportCount.current = count;
	}, [supportRequests.length]);
	const current = openId ? orders.find((o) => o.id === openId) ?? null : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-extrabold",
						children: "Pedidos de hoje"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Acompanhe a separação e entregas com comanda digital e troco calculado."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: supportRequests.length > 0 ? "hero" : "outline",
					size: "sm",
					onClick: () => setSupportOpen(true),
					className: "relative gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headset, {
							className: "size-4",
							"aria-hidden": true
						}),
						"Conversas Pendentes",
						supportRequests.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1 rounded-full bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground",
							children: supportRequests.length
						}) : null
					]
				})]
			}),
			supportRequests.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 rounded-2xl border-2 border-amber-500/50 bg-amber-50 p-4 text-amber-950 shadow-sm md:flex-row md:items-center md:justify-between dark:bg-amber-950/40 dark:text-amber-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headset, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-base font-bold",
						children: [supportRequests.length, " cliente(s) aguardando atendimento no WhatsApp!"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-amber-900/80 dark:text-amber-300/80",
						children: "Clicaram em \"Falar com atendente\". Esta lista é independente e não afeta os pedidos."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => setSupportOpen(true),
					className: "border-amber-600 bg-white font-bold text-amber-900 hover:bg-amber-100 dark:bg-amber-900 dark:text-white",
					children: [
						"Ver Conversas (",
						supportRequests.length,
						")"
					]
				})]
			}) : null,
			alert ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-pulse rounded-xl border-2 border-primary bg-primary/15 p-4 text-base font-bold text-primary-strong",
				children: "🔔 Chegou um pedido novo pelo WhatsApp!"
			}) : null,
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Carregando pedidos…"
			}) : orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-dashed border-border bg-card p-8 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-base font-semibold",
					children: "Nenhum pedido ainda"
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
				children: COLUMNS.map((column) => {
					const list = orders.filter((o) => o.status === column.status);
					const Icon = ICONS[column.status];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm font-bold uppercase tracking-wide text-secondary-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-4",
									"aria-hidden": true
								}),
								column.label,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto rounded-full bg-card px-2 py-0.5",
									children: list.length
								})
							]
						}), list.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: `rounded-2xl border bg-card p-4 shadow-sm ${order.status === "novo" ? "border-primary" : "border-border"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-lg font-extrabold",
										children: order.number
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xl font-extrabold text-primary-strong",
										children: brl(order.total)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground",
									children: [
										order.address.receiver,
										" • ",
										order.address.neighborhood || order.address.street
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "mt-2 space-y-0.5 text-sm",
									children: [order.items.slice(0, 3).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										qtyLabel(item.qty, item.unit),
										" ",
										item.name
									] }, item.name)), order.items.length > 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "text-muted-foreground",
										children: [
											"+ ",
											order.items.length - 3,
											" item(ns)"
										]
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentBanner, { order })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-col gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "soft",
										size: "xl",
										onClick: () => setOpenId(order.id),
										children: ["Abrir comanda ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { "aria-hidden": true })]
									}), column.next ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "hero",
										size: "xl",
										onClick: () => statusMutation.mutate({
											id: order.id,
											status: column.next
										}),
										children: column.nextLabel
									}) : null]
								})
							]
						}, order.id))]
					}, column.status);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: current != null,
				onOpenChange: (value) => !value && setOpenId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[92vh] max-w-lg overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
						className: "no-print",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "text-2xl",
							children: ["Comanda ", current?.number]
						})
					}), current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderTicket, {
						order: current,
						onToggleItem: (itemName) => checkMutation.mutate({
							id: current.id,
							checked: current.checked.includes(itemName) ? current.checked.filter((name) => name !== itemName) : [...current.checked, itemName]
						})
					}) : null]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: supportOpen,
				onOpenChange: setSupportOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[85vh] max-w-md overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 text-xl font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headset, { className: "size-5 text-amber-600" }), "Conversas Pendentes"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Clientes que solicitaram falar com a dona pelo WhatsApp. Não geram pedidos nem afetam a numeração."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 space-y-3",
							children: supportRequests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
								children: "🎉 Nenhuma conversa pendente no momento. Todos os clientes foram atendidos!"
							}) : supportRequests.map((req) => {
								const cleanPhone = req.customerPhone.replace(/\D/g, "");
								const waLink = cleanPhone ? `https://wa.me/55${cleanPhone}` : void 0;
								const formattedTime = new Date(req.createdAt).toLocaleTimeString("pt-BR", {
									hour: "2-digit",
									minute: "2-digit"
								});
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-2 rounded-xl border border-amber-300/50 bg-amber-50/50 p-3 shadow-sm dark:bg-amber-950/20",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-foreground",
												children: req.customerPhone || "Cliente WhatsApp"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground",
												children: formattedTime
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-foreground/80",
											children: req.message
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex gap-2",
											children: [waLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: waLink,
												target: "_blank",
												rel: "noreferrer",
												className: "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-600 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }), "Abrir WhatsApp"]
											}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => resolveMutation.mutate(req.id),
												className: "flex-1 gap-1.5 border-neutral-300 text-xs font-semibold hover:bg-neutral-100",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-green-600" }), "Marcar Atendido"]
											})]
										})
									]
								}, req.id);
							})
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Painel as component };
