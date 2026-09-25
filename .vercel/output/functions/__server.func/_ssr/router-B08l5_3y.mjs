import { i as __toESM, t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { t as supabase } from "./client-p1aOg0Wm.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, g as useRouter, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { a as Tags, g as MessageSquareText, s as ShoppingBasket } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B08l5_3y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-XMzbEQx9.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function PinGate({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$4 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Cebolão Empório e Verdurão" },
			{
				name: "description",
				content: "Pedidos pelo WhatsApp, comanda digital e controle de troco para a mercearia."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$4.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 border-b border-border bg-[image:var(--gradient-fresh)] px-4 py-3 text-primary-foreground shadow-[var(--shadow-soft)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-extrabold leading-tight",
						children: "🧅 Cebolão"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs opacity-90",
						children: "Empório e Verdurão "
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto w-full max-w-6xl px-4 py-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "no-print fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-border bg-card",
					children: [
						{
							to: "/",
							label: "Pedidos",
							Icon: ShoppingBasket
						},
						{
							to: "/catalogo",
							label: "Catálogo",
							Icon: Tags
						},
						{
							to: "/simulador",
							label: "Simulador WhatsApp",
							Icon: MessageSquareText
						}
					].map(({ to, label, Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to,
						activeOptions: { exact: to === "/" },
						className: "flex flex-col items-center gap-1 py-3 text-xs font-semibold text-muted-foreground",
						activeProps: { className: "text-primary-strong bg-primary/10" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-6",
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate px-1 text-center",
							children: label
						})]
					}, to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
			]
		}) })
	});
}
var $$splitComponentImporter$2 = () => import("./routes-adVKUSg0.mjs");
var Route$3 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Painel de Pedidos | Cebolão Empório e Verdurão" },
		{
			name: "description",
			content: "Painel da loja: acompanhe pedidos novos, separação e entregas com comanda digital e troco calculado."
		},
		{
			property: "og:title",
			content: "Painel de Pedidos | Cebolão Empório e Verdurão"
		},
		{
			property: "og:description",
			content: "Pedidos organizados por status, com comanda para impressão térmica."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./catalogo-CKzGJpw4.mjs");
var Route$2 = createFileRoute("/catalogo")({
	head: () => ({ meta: [
		{ title: "Catálogo de Preços | Cebolão" },
		{
			name: "description",
			content: "Cadastro rápido de preços por kg, unidade ou pacote com botão de disponível e esgotado."
		},
		{
			property: "og:title",
			content: "Catálogo de Preços | Cebolão"
		},
		{
			property: "og:description",
			content: "Atualize preços do hortifruti e da mercearia em poucos toques."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./simulador-CycVXKdj.mjs");
var Route$1 = createFileRoute("/simulador")({
	head: () => ({ meta: [{ title: "Simulador WhatsApp | Cebolão Empório e Verdurão" }, {
		name: "description",
		content: "Teste o assistente oficial de pedidos do WhatsApp do Cebolão com layout idêntico ao celular."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function normalize(text) {
	return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
}
/** Remove final 's' ou 'es' para aproximar singular/plural em português */
function stem(word) {
	if (word.endsWith("oes")) return word.slice(0, -3) + "ao";
	if (word.endsWith("es") && word.length > 4) return word.slice(0, -2);
	if (word.endsWith("s") && word.length > 3) return word.slice(0, -1);
	return word;
}
var STOP = /* @__PURE__ */ new Set([
	"de",
	"da",
	"do",
	"dos",
	"das",
	"e",
	"kg",
	"kilo",
	"kilos",
	"quilo",
	"quilos",
	"g",
	"gramas",
	"grama",
	"un",
	"unidade",
	"unidades",
	"pacote",
	"pacotes",
	"pct",
	"pe",
	"pes",
	"maco",
	"macos",
	"duzia",
	"duzias",
	"litro",
	"litros",
	"ml",
	"l",
	"por",
	"favor",
	"quero",
	"queria",
	"me",
	"ve",
	"coloca",
	"manda",
	"mais",
	"tambem",
	"pra",
	"mim"
]);
/** Divide o texto corrido do cliente ("1kg de tomate, 500g de cebola e 2 alfaces") em blocos de itens. */
function splitItems(text) {
	const normalized = text.replace(/* @__PURE__ */ new RegExp("(?<=[a-zA-Zá-úÁ-Ú)])\\s+(?=(\\d+(?:[.,]\\d+)?(?:\\s*(?:kg|kilos?|g|gramas?|un|und|unidades?|dz|duzias?|dúzias?|pes?|pés?|pct|pacotes?))?\\b|\\bmeio\\b|\\bum\\b|\\buma\\b))", "gi"), ", ");
	const splitPattern = /* @__PURE__ */ new RegExp("[,;\\n]+|\\se\\s(?=\\d|\\bmeio\\b|\\bum\\b|\\buma\\b)|\\smais\\s(?=\\d|\\bmeio\\b|\\bum\\b|\\buma\\b)", "gi");
	return normalized.split(splitPattern).map((chunk) => chunk.trim()).filter((chunk) => chunk.length > 0);
}
function parseQty(chunk) {
	const n = normalize(chunk);
	const grams = n.match(/(\d+(?:[.,]\d+)?)\s*(?:g|gramas?)\b/);
	if (grams?.[1]) {
		const val = parseFloat(grams[1].replace(",", "."));
		return {
			qty: Math.round(val / 1e3 * 1e3) / 1e3,
			explicitUnit: "kg",
			rest: n.replace(grams[0], " ")
		};
	}
	const oneAndHalf = n.match(/(\d+)\s*(?:e\s*meio|e\s*meia)\s*(?:kg|kilos?|quilos?)\b/) || n.match(/(\d+)\s*(?:kg|kilos?|quilos?)\s*e\s*meio\b/);
	if (oneAndHalf?.[1]) return {
		qty: parseFloat(oneAndHalf[1]) + .5,
		explicitUnit: "kg",
		rest: n.replace(oneAndHalf[0], " ")
	};
	const meioKg = n.match(/\b(?:meio|1\/2)\s*(?:kilo|quilo|kg)\b/);
	if (meioKg) return {
		qty: .5,
		explicitUnit: "kg",
		rest: n.replace(meioKg[0], " ")
	};
	const meiaDuzia = n.match(/\bmeia\s*(?:duzia|duzias)\b/);
	if (meiaDuzia) return {
		qty: .5,
		explicitUnit: "un",
		rest: n.replace(meiaDuzia[0], " ")
	};
	const kilos = n.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|kilos?|quilos?)\b/);
	if (kilos?.[1]) return {
		qty: parseFloat(kilos[1].replace(",", ".")),
		explicitUnit: "kg",
		rest: n.replace(kilos[0], " ")
	};
	const maco = n.match(/(\d+)\s*(?:macos?|maços?)\b/);
	if (maco?.[1]) return {
		qty: parseInt(maco[1], 10),
		explicitUnit: "un",
		rest: n.replace(maco[0], " ")
	};
	const pe = n.match(/(\d+)\s*(?:pes?|pés?)\b/);
	if (pe?.[1]) return {
		qty: parseInt(pe[1], 10),
		explicitUnit: "un",
		rest: n.replace(pe[0], " ")
	};
	const pack = n.match(/(\d+)\s*(?:pacotes?|pct|sacos?)\b/);
	if (pack?.[1]) return {
		qty: parseInt(pack[1], 10),
		explicitUnit: "pct",
		rest: n.replace(pack[0], " ")
	};
	const duzia = n.match(/(\d+)\s*(?:duzias?|dúzias?)\b/);
	if (duzia?.[1]) return {
		qty: parseInt(duzia[1], 10),
		explicitUnit: "un",
		rest: n.replace(duzia[0], " ")
	};
	const unMatch = n.match(/(\d+)\s*(?:unidades?|unids?|un)\b/);
	if (unMatch?.[1]) return {
		qty: parseInt(unMatch[1], 10),
		explicitUnit: "un",
		rest: n.replace(unMatch[0], " ")
	};
	for (const [w, val] of Object.entries({
		um: 1,
		uma: 1,
		dois: 2,
		duas: 2,
		tres: 3,
		quatro: 4,
		cinco: 5
	})) {
		const r = new RegExp(`\\b${w}\\b`, "i");
		if (r.test(n)) return {
			qty: val,
			explicitUnit: null,
			rest: n.replace(r, " ")
		};
	}
	const plain = n.match(/(\d+(?:[.,]\d+)?)/);
	if (plain?.[1]) return {
		qty: parseFloat(plain[1].replace(",", ".")),
		explicitUnit: null,
		rest: n.replace(plain[0], " ")
	};
	return {
		qty: 1,
		explicitUnit: null,
		rest: n
	};
}
function scoreProduct(tokens, product) {
	const pTokens = normalize(product.name).replace(/[()]/g, " ").split(" ").map(stem).filter((t) => t.length > 2 && !STOP.has(t));
	let score = 0;
	for (const token of tokens) {
		const sToken = stem(token);
		for (const p of pTokens) if (p === sToken) score += 4;
		else if (p.startsWith(sToken) || sToken.startsWith(p)) score += 2.5;
		else if (p.includes(sToken) || sToken.includes(p)) score += 1.5;
	}
	return score;
}
/** Limpa uma string desconhecida para deixar apenas o nome do produto mencionado */
function cleanUnknownName(chunk) {
	const words = normalize(chunk).replace(/[^a-z0-9 ]/g, " ").split(" ").map((w) => w.trim()).filter((w) => w.length > 2 && !STOP.has(w) && !/^\d+$/.test(w));
	return words.length ? words.join(" ") : chunk.trim();
}
function parseOrderText(text, products) {
	const items = [];
	const unknown = [];
	const unavailable = [];
	for (const chunk of splitItems(text)) {
		const { qty, explicitUnit, rest } = parseQty(chunk);
		const tokens = rest.replace(/[^a-z0-9 ]/g, " ").split(" ").map((t) => t.trim()).filter((t) => t.length > 1 && !STOP.has(t) && !/^\d+$/.test(t));
		if (tokens.length === 0) {
			const clean = cleanUnknownName(chunk);
			if (clean) unknown.push(clean);
			continue;
		}
		let best = null;
		let bestScore = 0;
		for (const product of products) {
			const score = scoreProduct(tokens, product);
			if (score > bestScore) {
				bestScore = score;
				best = product;
			}
		}
		if (!best || bestScore < 2.5) {
			const clean = cleanUnknownName(chunk);
			if (clean) unknown.push(clean);
			continue;
		}
		if (!best.available) {
			unavailable.push(best.name);
			continue;
		}
		const unit = explicitUnit && explicitUnit === best.unit ? explicitUnit : best.unit;
		const finalQty = unit === "kg" ? Math.round(qty * 1e3) / 1e3 : Math.max(1, Math.round(qty));
		const existing = items.find((i) => i.productId === best.id);
		if (existing) {
			existing.qty = Math.round((existing.qty + finalQty) * 1e3) / 1e3;
			existing.total = Math.round(existing.qty * existing.unitPrice * 100) / 100;
			continue;
		}
		items.push({
			productId: best.id,
			name: best.name,
			qty: finalQty,
			unit,
			unitPrice: best.price,
			total: Math.round(finalQty * best.price * 100) / 100,
			raw: chunk.trim()
		});
	}
	return {
		items,
		unknown,
		unavailable
	};
}
function sum(items) {
	return Math.round(items.reduce((acc, i) => acc + i.total, 0) * 100) / 100;
}
/**
* Detecta se o cliente pediu para remover algum item na revisão.
* Ex: "tirar tomate", "remover cebola", "sem o arroz", "cancela a banana", "tira o 1"
*/
function extractRemoval(text, items) {
	const n = normalize(text);
	if (!(n.startsWith("tira") || n.startsWith("remover") || n.startsWith("remova") || n.startsWith("tirar") || n.startsWith("sem ") || n.startsWith("cancela") || n.startsWith("apaga") || n.includes("nao quero") || n.includes("retirar"))) return {
		removed: null,
		remaining: items
	};
	const numMatch = n.match(/\b(?:item\s*)?(\d+)\b/);
	if (numMatch?.[1]) {
		const idx = parseInt(numMatch[1], 10) - 1;
		if (idx >= 0 && idx < items.length) return {
			removed: items[idx],
			remaining: items.filter((_, i) => i !== idx)
		};
	}
	const words = n.replace(/^(tira[r]?|remove[r]?|remova|sem|cancela[r]?|apaga[r]?|retira[r]?|nao quero|o|a|os|as|do|da|de)\s+/gi, "").trim().split(" ").map(stem).filter((w) => w.length > 2 && !STOP.has(w));
	let bestMatch = null;
	let bestScore = 0;
	for (const item of items) {
		const itemTokens = normalize(item.name).replace(/[()]/g, " ").split(" ").map(stem);
		let score = 0;
		for (const w of words) if (itemTokens.some((t) => t === w || t.includes(w) || w.includes(t))) score += 2;
		if (score > bestScore) {
			bestScore = score;
			bestMatch = item;
		}
	}
	if (bestMatch && bestScore > 0) return {
		removed: bestMatch,
		remaining: items.filter((i) => i !== bestMatch)
	};
	return {
		removed: null,
		remaining: items
	};
}
function brl(value) {
	return value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL"
	});
}
function qtyLabel(qty, unit) {
	if (unit === "kg") return qty < 1 ? `${Math.round(qty * 1e3)}g` : `${qty.toLocaleString("pt-BR")}kg`;
	return `${qty} ${unit === "pct" ? "pct" : "un"}`;
}
var CATEGORIES = [
	"Hortifruti",
	"Mercearia",
	"Laticínios e Frios",
	"Bebidas",
	"Limpeza"
];
var PIX_KEY = "cebolao@emporio.com.br";
var STORE_NAME = "Cebolão Empório e Verdurão";
var PRODUCTS_KEY = ["products"];
var ORDERS_KEY = ["orders"];
var num = (value) => Number(value ?? 0);
function toProduct(row) {
	return {
		id: row.id,
		name: row.name,
		category: row.category,
		unit: row.unit,
		price: num(row.price),
		available: row.available
	};
}
function toOrder(row) {
	const address = row.address ?? {};
	const items = Array.isArray(row.items) ? row.items : [];
	return {
		id: row.id,
		number: `#${String(row.number).padStart(3, "0")}`,
		createdAt: row.created_at,
		customerPhone: row.customer_phone,
		items: items.map((item) => ({
			productId: item.productId ?? null,
			name: item.name,
			qty: num(item.qty),
			unit: item.unit,
			unitPrice: num(item.unitPrice),
			total: num(item.total),
			raw: item.raw ?? item.name
		})),
		subtotal: num(row.subtotal),
		deliveryFee: num(row.delivery_fee),
		total: num(row.total),
		payment: {
			method: row.payment_method,
			...row.cash_for != null ? { cashFor: num(row.cash_for) } : {},
			...row.change_amount != null ? { change: num(row.change_amount) } : {}
		},
		address: {
			street: address.street ?? "",
			number: address.number ?? "",
			neighborhood: address.neighborhood ?? "",
			complement: address.complement ?? "",
			reference: address.reference ?? "",
			receiver: address.receiver ?? ""
		},
		status: row.status,
		checked: row.checked ?? [],
		source: row.source === "whatsapp" ? "whatsapp" : "simulador"
	};
}
async function fetchProducts() {
	const { data, error } = await supabase.from("products").select("id, name, category, unit, price, available").order("created_at", { ascending: true });
	if (error) throw error;
	return data.map(toProduct);
}
async function fetchOrders() {
	const { data, error } = await supabase.from("orders").select("*").order("number", { ascending: false });
	if (error) throw error;
	return data.map(toOrder);
}
async function createProduct(input) {
	const { error } = await supabase.from("products").insert({
		name: input.name,
		category: input.category,
		unit: input.unit,
		price: input.price,
		available: true
	});
	if (error) throw error;
}
async function updateProduct(id, patch) {
	const { error } = await supabase.from("products").update(patch).eq("id", id);
	if (error) throw error;
}
async function deleteProduct(id) {
	const { error } = await supabase.from("products").delete().eq("id", id);
	if (error) throw error;
}
async function updateOrderStatus(id, status) {
	const { error } = await supabase.from("orders").update({ status }).eq("id", id);
	if (error) throw error;
}
async function updateChecked(id, checked) {
	const { error } = await supabase.from("orders").update({ checked }).eq("id", id);
	if (error) throw error;
}
var db = supabase;
var SUPPORT_KEY = ["support-requests"];
async function createOrderFromBot(input) {
	const cashFor = input.payment.cashFor ?? null;
	const change = input.payment.method === "cash" && cashFor != null ? Math.round((cashFor - input.total) * 100) / 100 : null;
	const { data, error } = await db.from("orders").insert({
		customer_phone: input.customerPhone,
		items: input.items,
		subtotal: input.subtotal,
		delivery_fee: input.deliveryFee,
		total: input.total,
		payment_method: input.payment.method,
		cash_for: cashFor,
		change_amount: change,
		address: input.address,
		status: "novo",
		source: input.source
	}).select("id, number").single();
	if (error) throw error;
	const row = data;
	try {
		const itemsPayload = input.items.map((item) => ({
			order_id: row.id,
			product_name: item.name,
			quantity: item.qty,
			unit_price: item.unitPrice,
			total_price: item.total
		}));
		const { error: itemsError } = await supabase.from("order_items").insert(itemsPayload);
		if (itemsError) console.warn("[createOrderFromBot] Aviso ao gravar em order_items (pedido preservado em orders):", itemsError.message);
	} catch (err) {
		console.warn("[createOrderFromBot] Falha não impeditiva ao gravar em order_items:", err);
	}
	return `#${String(row.number).padStart(3, "0")}`;
}
async function createSupportRequest(customerPhone, message) {
	const { error } = await db.from("support_requests").insert({
		customer_phone: customerPhone,
		message: message ?? "Cliente solicitou atendimento humano",
		handled: false
	});
	if (error) throw error;
}
async function fetchSupportRequests() {
	const { data, error } = await db.from("support_requests").select("id, customer_phone, message, created_at").or("handled.eq.false,handled.is.null").order("created_at", { ascending: false });
	if (error) throw error;
	return data.map((row) => ({
		id: row.id,
		customerPhone: row.customer_phone,
		message: row.message,
		createdAt: row.created_at
	}));
}
async function resolveSupportRequest(id) {
	const { error } = await db.from("support_requests").update({ handled: true }).eq("id", id);
	if (error) throw error;
}
var WELCOME_TEXT = "Oi! 😊 Aqui é o Cebolão Empório e Verdurão — hortifruti fresquinho e mercearia com entrega no Setor Oeste e região. Como posso te ajudar hoje?";
var WELCOME_BUTTONS = ["Fazer pedido", "Falar com atendente"];
function initialBotState() {
	return {
		step: "start",
		items: [],
		unknownItems: [],
		address: {
			street: "",
			number: "",
			neighborhood: "",
			complement: "",
			reference: "",
			receiver: ""
		},
		payment: null,
		cashFor: null,
		change: null
	};
}
function subtotalOf(state) {
	return sum(state.items);
}
function totalOf(state) {
	return Math.round((subtotalOf(state) + 5) * 100) / 100;
}
var PAYMENT_BUTTONS = [
	"Pix",
	"Cartão na entrega",
	"Dinheiro"
];
function itemsListText(state) {
	return [
		"*Itens identificados:*",
		...state.items.map((item, index) => `${index + 1}. ${qtyLabel(item.qty, item.unit)} ${item.name} — ${brl(item.total)}`),
		"",
		`Subtotal: ${brl(subtotalOf(state))}`,
		`Taxa de entrega: ${brl(5)}`,
		`*Total parcial: ${brl(totalOf(state))}*`
	].join("\n");
}
function summaryText(state, orderNumber) {
	const lines = state.items.map((item) => `• ${qtyLabel(item.qty, item.unit)} ${item.name} — ${brl(item.total)}`);
	const payment = state.payment === "pix" ? "Pix" : state.payment === "card" ? "Cartão na entrega (motoboy leva maquininha)" : "Dinheiro";
	const trocoText = state.payment === "cash" && state.cashFor && state.cashFor > totalOf(state) ? `\r\n  💵 Troco de ${brl(state.change ?? Math.round((state.cashFor - totalOf(state)) * 100) / 100)} para ${brl(state.cashFor)}` : state.payment === "cash" ? "\r\n  💵 Pagamento exato (sem troco)" : "";
	return [
		orderNumber ? `🎉 *Pedido #${orderNumber} confirmado com sucesso!*` : "📋 *Resumo do Pedido*",
		"",
		...lines,
		"",
		`Subtotal: ${brl(subtotalOf(state))}`,
		`Taxa de entrega: ${brl(5)}`,
		`*Total: ${brl(totalOf(state))}*`,
		`Forma de pagamento: ${payment}${trocoText}`,
		"",
		`📍 *Endereço:* ${state.address.street}`,
		`👤 *Recebe:* ${state.address.receiver}`,
		`📅 *Data e Hora:* ${new Intl.DateTimeFormat("pt-BR", {
			dateStyle: "short",
			timeStyle: "short",
			timeZone: "America/Sao_Paulo"
		}).format(/* @__PURE__ */ new Date()).replace(", ", " às ")}`
	].join("\n");
}
function alternatives(products, missing) {
	const suggestions = products.filter((p) => missing.includes(p.name)).map((product) => {
		const other = products.find((p) => p.available && p.category === product.category && p.id !== product.id);
		return other ? `• Em vez de ${product.name}, temos ${other.name} (${brl(other.price)}/${other.unit}).` : null;
	}).filter((line) => line != null);
	return suggestions.length ? `Sugestões disponíveis hoje:\n${suggestions.join("\n")}` : "No momento não temos substitutos diretos nessa categoria.";
}
/** Motor da conversa: processa texto ou clique de botão e devolve as respostas do bot */
function advance(state, input, products) {
	const text = input.trim();
	const n = normalize(text);
	const keep = (replies, step = state.step) => ({
		state: {
			...state,
			step
		},
		replies
	});
	if (n === "reiniciar" || n === "voltar" || n === "voltar ao menu" || n === "voltar ao inicio" || n === "voltar ao início" || n === "inicio" || n === "início" || n === "menu" || n === "menu principal" || n === "reiniciar conversa" || n === "novo teste" || n === "comecar de novo" || n === "cancelar pedido") return {
		state: initialBotState(),
		replies: [{
			text: "Voltamos ao início! Como posso te ajudar hoje? 😊",
			buttons: WELCOME_BUTTONS
		}]
	};
	if (n === "falar com atendente" || n === "atendente" || n === "falar com humano" || n === "atendente humano") return {
		state: {
			...initialBotState(),
			step: "human"
		},
		replies: [{
			text: "Tudo bem! O responsável irá atendê-lo em instantes. Deixe aqui a sua mensagem 😊",
			buttons: ["Voltar ao início"],
			buttons: ["Voltar ao início"]
		}],
		action: "human"
	};
	if (n === "fazer um pedido" || n === "fazer pedido" || n === "quero fazer um pedido" || n === "novo pedido") return {
		state: {
			...initialBotState(),
			step: "items"
		},
		replies: [{
			text: "Que ótimo! 😀 Me mande a sua lista de compras em uma mensagem só.\n\nPor exemplo: *1kg de tomate, 500g de cebola, 2 pés de alface e 1 óleo Liza*",
			buttons: ["Voltar ao início"]
		}]
	};
	switch (state.step) {
		case "human":
			if (n === "voltar" || n === "reiniciar" || n === "menu") return {
				state: initialBotState(),
				replies: [{
					text: "Voltamos ao início! Como posso te ajudar hoje?",
					buttons: WELCOME_BUTTONS
				}]
			};
			return {
				state,
				replies: [{ text: "Sua mensagem foi recebida e será respondida em breve. 😊 Se quiser voltar ao menu principal, digite 'voltar'." }],
				action: "human"
			};
		case "start":
		case "done":
			if (n.includes("atendente") || n.includes("humano") || n.includes("falar com") || n.includes("dona")) return {
				state: {
					...initialBotState(),
					step: "human"
				},
				replies: [{ text: "Tudo bem! O responsável irá atendê-lo em instantes. Deixe aqui a sua mensagem 😊" }],
				action: "human"
			};
			if (n.includes("pedido") || n.includes("comprar") || n.includes("fazer pedido") || n.includes("quero comprar") || n.includes("sim") || n.includes("oi") || n.includes("ola")) return {
				state: {
					...initialBotState(),
					step: "items"
				},
				replies: [{ text: "Que ótimo! 😀 Me mande a sua lista de compras em uma mensagem só.\n\nPor exemplo: *1kg de tomate, 500g de cebola, 2 pés de alface e 1 óleo Liza*" }]
			};
			return keep([{
				text: WELCOME_TEXT,
				buttons: WELCOME_BUTTONS
			}], "start");
		case "items": {
			const { items, unknown, unavailable } = parseOrderText(text, products);
			if (items.length === 0 && unknown.length > 0) {
				const missingName = unknown[0];
				return keep([{ text: `Não temos '${missingName}' no momento 😕.\n\nQuer tentar outro produto do nosso catálogo? Me envie o que deseja comprar:` }]);
			}
			if (items.length === 0) return keep([{ text: `${unavailable.length ? `Infelizmente ${unavailable.join(", ")} está esgotado hoje.\n${alternatives(products, unavailable)}\n\n` : ""}Não consegui identificar os produtos na mensagem. Pode escrever a quantidade e o produto?\nExemplo: *2kg de batata, 1 leite e 500g de cebola*` }]);
			const mergedState = {
				...state,
				items
			};
			const replies = [];
			if (unavailable.length > 0) replies.push({ text: `⚠️ *Aviso de estoque:* Infelizmente ${unavailable.join(", ")} está esgotado hoje.\n${alternatives(products, unavailable)}` });
			if (unknown.length > 0) {
				const missingName = unknown[0];
				replies.push({
					text: `Não temos '${missingName}' no momento 😕. Quer continuar o pedido sem esse item ou gostaria de adicionar outro no lugar?`,
					buttons: [`Continuar sem ${missingName}`, "Adicionar outro item"]
				});
				return {
					state: {
						...mergedState,
						unknownItems: unknown,
						step: "unknown_item_prompt"
					},
					replies
				};
			}
			replies.push({
				text: `${itemsListText(mergedState)}\n\nConfere? Quer adicionar, remover ou corrigir algum item?`,
				buttons: ["Está certo! Prosseguir", "Alterar pedido"]
			});
			return {
				state: {
					...mergedState,
					step: "review"
				},
				replies
			};
		}
		case "unknown_item_prompt": {
			if (n.includes("continuar sem") || n.includes("continuar") || n.includes("seguir") || n.includes("sem ele") || n.includes("sem esse") || n.includes("pode ser sem")) return {
				state: {
					...state,
					step: "review",
					unknownItems: []
				},
				replies: [{
					text: `Combinado! Seguindo sem o item.\n\n${itemsListText(state)}\n\nConfere? Quer adicionar, remover ou corrigir algum item?`,
					buttons: ["Está certo! Prosseguir", "Alterar pedido"]
				}]
			};
			if (n.includes("adicionar outro") || n.includes("outro") || n.includes("substituir")) return keep([{ text: "Pode me dizer qual produto você gostaria de colocar no lugar (ex: 'coloca 1kg de batata'):" }]);
			const extra = parseOrderText(text, products);
			if (extra.items.length > 0) {
				const items = [...state.items];
				for (const item of extra.items) {
					const existing = items.find((i) => i.productId === item.productId);
					if (existing) {
						existing.qty = Math.round((existing.qty + item.qty) * 1e3) / 1e3;
						existing.total = Math.round(existing.qty * existing.unitPrice * 100) / 100;
					} else items.push(item);
				}
				const updatedState = {
					...state,
					items,
					unknownItems: [],
					step: "review"
				};
				return {
					state: updatedState,
					replies: [{
						text: `Adicionei à lista! Veja como ficou:\n\n${itemsListText(updatedState)}\n\nConfere? Quer adicionar, remover ou corrigir algum item?`,
						buttons: ["Está certo! Prosseguir", "Alterar pedido"]
					}]
				};
			}
			return keep([{
				text: "Quer continuar o pedido sem o produto que não temos ou gostaria de adicionar outro?",
				buttons: ["Continuar sem esse item", "Adicionar outro item"]
			}]);
		}
		case "review": {
			if (n === "esta certo! prosseguir" || n === "esta certo" || n === "prosseguir" || n === "sim" || n === "confere" || n === "tudo certo" || n === "pode prosseguir" || n === "ok" || n === "fechar" || n === "continuar") return {
				state: {
					...state,
					step: "address"
				},
				replies: [{ text: "Perfeito! Agora vamos para o endereço de entrega.\n\nPor favor, digite o endereço de entrega em uma só linha (rua, número, bairro, complemento e ponto de referência, se tiver)." }]
			};
			const removal = extractRemoval(text, state.items);
			if (removal.removed) {
				const remaining = removal.remaining;
				if (remaining.length === 0) return {
					state: {
						...state,
						items: [],
						step: "items"
					},
					replies: [{ text: `Removi ${removal.removed.name}. Sua lista agora está vazia. Pode me enviar uma nova lista de itens:` }]
				};
				const updatedState = {
					...state,
					items: remaining
				};
				return {
					state: updatedState,
					replies: [{
						text: `Removi *${removal.removed.name}* da lista! ✅\n\n${itemsListText(updatedState)}\n\nConfere? Quer adicionar, remover ou corrigir algum item?`,
						buttons: ["Está certo! Prosseguir", "Alterar pedido"]
					}]
				};
			}
			const additions = parseOrderText(text, products);
			if (additions.items.length > 0) {
				const items = [...state.items];
				for (const item of additions.items) {
					const existing = items.find((i) => i.productId === item.productId);
					if (existing) {
						existing.qty = Math.round((existing.qty + item.qty) * 1e3) / 1e3;
						existing.total = Math.round(existing.qty * existing.unitPrice * 100) / 100;
					} else items.push(item);
				}
				const updatedState = {
					...state,
					items
				};
				const extraReplies = [];
				if (additions.unknown.length > 0) extraReplies.push({ text: `Aviso: não temos '${additions.unknown[0]}' no momento 😕.` });
				extraReplies.push({
					text: `Atualizei seu pedido! 🛒\n\n${itemsListText(updatedState)}\n\nConfere? Quer adicionar, remover ou corrigir algum item?`,
					buttons: ["Está certo! Prosseguir", "Alterar pedido"]
				});
				return {
					state: updatedState,
					replies: extraReplies
				};
			}
			if (n === "deixa assim mesmo" || n === "deixa assim" || n === "nada" || n === "nada nao" || n === "nada não" || n === "deixa como ta" || n === "deixa como está" || n === "pode deixar" || n === "nao quero mudar nada" || n === "não quero mudar nada" || n === "cancela") return keep([{
				text: `Perfeito, mantive seu pedido como estava! 👍\n\n${itemsListText(state)}\n\nPodemos prosseguir?`,
				buttons: ["Está certo! Prosseguir", "Alterar pedido"]
			}]);
			if (n === "alterar pedido" || n === "alterar" || n.includes("mudar") || n.includes("corrigir") || n.includes("adicionar mais")) return keep([{
				text: "O que você gostaria de mudar? 😊\n\nVocê pode me dizer:\n• O que tirar (ex: *'tirar tomate'*)\n• O que adicionar (ex: *'mais 1kg de banana'*)\n• Ou enviar sua lista completa novamente.",
				buttons: ["Voltar ao início"]
			}]);
			const directAdditions = parseItemsInput(text, products);
			if (directAdditions.items.length > 0) {
				const items = [...state.items];
				for (const item of directAdditions.items) {
					const existing = items.find((i) => i.productId === item.productId);
					if (existing) {
						existing.qty = Math.round((existing.qty + item.qty) * 1e3) / 1e3;
						existing.total = Math.round(existing.qty * existing.unitPrice * 100) / 100;
					} else items.push(item);
				}
				const updatedState = {
					...state,
					items
				};
				const replies = [];
				if (directAdditions.unknown.length > 0) replies.push({ text: `Aviso: não temos '${directAdditions.unknown[0]}' no momento.` });
				replies.push({
					text: `Atualizei seu pedido! 🛒\n\n${itemsListText(updatedState)}\n\nTudo certo agora?`,
					buttons: ["Está certo! Prosseguir", "Alterar pedido"]
				});
				return {
					state: updatedState,
					replies
				};
			}
			return keep([{
				text: "Podemos prosseguir com esse pedido ou gostaria de ajustar algum item?",
				buttons: ["Está certo! Prosseguir", "Alterar pedido"]
			}]);
		}
		case "address":
			if (text.length < 5) return keep([{ text: "Por favor, digite o endereço completo em uma linha só (rua, número, bairro, complemento e ponto de referência, se tiver)." }]);
			return {
				state: {
					...state,
					address: {
						...state.address,
						street: text
					},
					step: "receiver_name"
				},
				replies: [{ text: "Anotado! 📍\n\nE quem vai receber o pedido? Por favor, digite o seu nome." }]
			};
		case "receiver_name":
			if (text.length < 2) return keep([{ text: "Como é o nome de quem vai receber, por favor?" }]);
			return {
				state: {
					...state,
					address: {
						...state.address,
						receiver: text
					},
					step: "payment"
				},
				replies: [{
					text: `Muito obrigado, ${text}! 😊\n\nSubtotal dos itens: ${brl(subtotalOf(state))}\nTaxa de entrega fixa: ${brl(5)}\n*Total a pagar: ${brl(totalOf(state))}*\n\nComo você prefere fazer o pagamento?`,
					buttons: PAYMENT_BUTTONS
				}]
			};
		case "payment":
			if (n.includes("pix")) {
				const nextState = {
					...state,
					payment: "pix",
					cashFor: null,
					change: null,
					step: "confirm_final"
				};
				return {
					state: nextState,
					replies: [{ text: `Chave Pix do Cebolão (Copia e Cola):\n\`${PIX_KEY}\`\n\nVocê pode efetuar a transferência e nos enviar o comprovante após a confirmação.` }, {
						text: summaryText(nextState),
						buttons: [
							"Confirmar pedido",
							"Alterar forma de pagamento",
							"Alterar pedido"
						]
					}]
				};
			}
			if (n.includes("cartao") || n.includes("credito") || n.includes("debito") || n.includes("maquininha")) {
				const nextState = {
					...state,
					payment: "card",
					cashFor: null,
					change: null,
					step: "confirm_final"
				};
				return {
					state: nextState,
					replies: [{ text: "Combinado! Vamos avisar o motoboy para levar a maquininha ðŸ’³" }, {
						text: summaryText(nextState),
						buttons: [
							"Confirmar pedido",
							"Alterar forma de pagamento",
							"Alterar pedido"
						]
					}]
				};
			}
			if (n.includes("dinheiro") || n.includes("especie") || n.includes("nota")) return {
				state: {
					...state,
					payment: "cash",
					step: "cash_change"
				},
				replies: [{ text: `O total da compra é ${brl(totalOf(state))}.\n\nPrecisa de troco para quanto? (Se tiver o valor exato, pode responder 'não precisa')` }]
			};
			return keep([{
				text: "Como você prefere fazer o pagamento?",
				buttons: PAYMENT_BUTTONS
			}]);
		case "cash_change": {
			const total = totalOf(state);
			if (n.includes("nao precisa") || n.includes("sem troco") || n.includes("exato") || n === "nao") {
				const nextState = {
					...state,
					cashFor: total,
					change: 0,
					step: "confirm_final"
				};
				return {
					state: nextState,
					replies: [{ text: "Combinado! Pagamento em dinheiro no valor exato. ðŸ’µ" }, {
						text: summaryText(nextState),
						buttons: [
							"Confirmar pedido",
							"Alterar forma de pagamento",
							"Alterar pedido"
						]
					}]
				};
			}
			const match = text.replace(/[^\d,.]/g, "").replace(",", ".");
			const val = parseFloat(match);
			if (!val || Number.isNaN(val)) return keep([{ text: `Precisa de troco para quanto? Digite o valor da nota que vai pagar (ex: 50 ou 100), ou diga 'não precisa'. Seu total é ${brl(total)}.` }]);
			if (val < total) return keep([{ text: `O total do pedido é ${brl(total)}. A nota de ${brl(val)} não cobre o valor. Precisa de troco para quanto?` }]);
			const trocoCalculado = Math.round((val - total) * 100) / 100;
			const nextState = {
				...state,
				cashFor: val,
				change: trocoCalculado,
				step: "confirm_final"
			};
			return {
				state: nextState,
				replies: [{ text: `Anotado! Troco de ${brl(trocoCalculado)} para a nota de ${brl(val)}. 💵` }, {
					text: summaryText(nextState),
					buttons: [
						"Confirmar pedido",
						"Alterar forma de pagamento",
						"Alterar pedido"
					]
				}]
			};
		}
		case "confirm_final":
			if (n === "alterar forma de pagamento" || n === "alterar pagamento" || n === "mudar pagamento" || n === "trocar pagamento") return {
				state: {
					...state,
					step: "payment"
				},
				replies: [{
					text: "Sem problemas! Como você prefere fazer o pagamento?",
					buttons: PAYMENT_BUTTONS
				}]
			};
			if (n.includes("confirmar") || n.includes("confirmar pedido") || n === "sim" || n === "pode mandar" || n === "ok") return {
				state: {
					...state,
					step: "done"
				},
				replies: [],
				action: "create_order"
			};
			if (n.includes("voltar") || n.includes("corrigir") || n.includes("cancelar")) return {
				state: {
					...state,
					step: "review"
				},
				replies: [{
					text: `Voltamos para a revisão dos itens:\n\n${itemsListText(state)}\n\nO que gostaria de adicionar, remover ou corrigir?`,
					buttons: ["Está certo! Prosseguir", "Alterar pedido"]
				}]
			};
			return keep([{
				text: "Podemos enviar esse pedido para a loja?",
				buttons: [
					"Confirmar pedido",
					"Alterar forma de pagamento",
					"Alterar pedido"
				]
			}]);
		default: return keep([{
			text: WELCOME_TEXT,
			buttons: WELCOME_BUTTONS
		}], "start");
	}
}
function json(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "content-type": "application/json; charset=utf-8" }
	});
}
function extractIncoming(body) {
	if (!body || typeof body !== "object") return null;
	if (body.data && body.data.key) {
		const key = body.data.key;
		if (key.fromMe) return {
			phone: "",
			text: "",
			isFromMe: true
		};
		const phone = (key.remoteJid || "").replace(/@.*$/, "").replace(/\D/g, "");
		const msg = body.data.message || {};
		const text = msg.conversation || msg.extendedTextMessage?.text || msg.buttonsResponseMessage?.selectedDisplayText || msg.buttonsResponseMessage?.selectedButtonId || msg.templateButtonReplyMessage?.selectedDisplayText || msg.templateButtonReplyMessage?.selectedId || msg.listResponseMessage?.title || msg.listResponseMessage?.singleSelectReply?.selectedRowId || "";
		return {
			phone,
			text: String(text).trim(),
			senderName: body.data.pushName,
			isFromMe: false
		};
	}
	if (body.phone && (body.text || body.buttonResponse || body.messageId)) {
		if (body.fromMe) return {
			phone: "",
			text: "",
			isFromMe: true
		};
		const phone = String(body.phone).replace(/\D/g, "");
		const text = body.text?.message || body.buttonResponse?.buttonText || body.buttonResponse?.buttonId || body.message || "";
		return {
			phone,
			text: String(text).trim(),
			senderName: body.senderName,
			isFromMe: false
		};
	}
	if (body.phone && (body.message || body.text)) return {
		phone: String(body.phone).replace(/\D/g, ""),
		text: String(body.message || body.text).trim(),
		isFromMe: false
	};
	return null;
}
var Route = createFileRoute("/api/public/whatsapp")({ server: { handlers: {
	GET: async () => json({
		ok: true,
		service: "Cebolão Empório e Verdurão — Webhook de WhatsApp",
		supported_apis: [
			"Evolution API",
			"Z-API",
			"Custom POST"
		],
		usage: "POST payload do webhook do WhatsApp para processar e atualizar o Supabase"
	}),
	POST: async ({ request }) => {
		const token = process.env["WHATSAPP_WEBHOOK_TOKEN"];
		if (token && request.headers.get("x-webhook-token") !== token) return json({ error: "unauthorized" }, 401);
		const incoming = extractIncoming(await request.json().catch(() => null));
		if (!incoming || incoming.isFromMe) return json({
			ok: true,
			ignored: true
		});
		if (!incoming.phone || !incoming.text) return json({ error: "missing_phone_or_text" }, 400);
		const products = await fetchProducts();
		const { data: sessionData } = await supabase.from("whatsapp_sessions").select("state").eq("phone", incoming.phone).maybeSingle();
		const result = advance(sessionData?.state ? sessionData.state : initialBotState(), incoming.text, products);
		await supabase.from("whatsapp_sessions").upsert({
			phone: incoming.phone,
			state: result.state,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		let orderNumber;
		if (result.action === "human") await createSupportRequest(incoming.phone);
		if (result.action === "create_order") {
			orderNumber = await createOrderFromBot({
				customerPhone: incoming.phone,
				items: result.state.items,
				subtotal: subtotalOf(result.state),
				deliveryFee: 5,
				total: totalOf(result.state),
				payment: {
					method: result.state.payment ?? "pix",
					cashFor: result.state.cashFor
				},
				address: result.state.address,
				source: "whatsapp"
			});
			result.replies.push({ text: `${summaryText(result.state, orderNumber)}\n\n🛵 *Seu pedido já caiu na tela de separação da loja!* Muito obrigado pela preferência! 🧅💚` });
		}
		return json({
			ok: true,
			phone: incoming.phone,
			action: result.action ?? null,
			order_number: orderNumber ?? null,
			replies: result.replies
		});
	}
} } });
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	CatalogoRoute: Route$2.update({
		id: "/catalogo",
		path: "/catalogo",
		getParentRoute: () => Route$4
	}),
	SimuladorRoute: Route$1.update({
		id: "/simulador",
		path: "/simulador",
		getParentRoute: () => Route$4
	}),
	ApiPublicWhatsappRoute: Route.update({
		id: "/api/public/whatsapp",
		path: "/api/public/whatsapp",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { CATEGORIES as C, qtyLabel as D, brl as E, updateProduct as S, STORE_NAME as T, fetchProducts as _, initialBotState as a, updateChecked as b, totalOf as c, SUPPORT_KEY as d, createOrderFromBot as f, fetchOrders as g, deleteProduct as h, advance as i, ORDERS_KEY as l, createSupportRequest as m, WELCOME_BUTTONS as n, subtotalOf as o, createProduct as p, WELCOME_TEXT as r, summaryText as s, router_exports as t, PRODUCTS_KEY as u, fetchSupportRequests as v, PIX_KEY as w, updateOrderStatus as x, resolveSupportRequest as y };
