import { i as __toESM } from "./rolldown-runtime-D7D4PA-g.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as Plus, i as Trash2 } from "../_libs/lucide-react.mjs";
import { C as CATEGORIES, E as brl, S as updateProduct, _ as fetchProducts, h as deleteProduct, p as createProduct, u as PRODUCTS_KEY } from "./router-B08l5_3y.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn, t as Button } from "./button-B3D86jL6.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalogo-CKzGJpw4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
var UNITS = [
	{
		value: "kg",
		label: "por kg"
	},
	{
		value: "un",
		label: "unidade"
	},
	{
		value: "pct",
		label: "pacote"
	}
];
function CatalogoPage() {
	const queryClient = useQueryClient();
	const { data: products = [], isLoading } = useQuery({
		queryKey: PRODUCTS_KEY,
		queryFn: fetchProducts
	});
	const [name, setName] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)("");
	const [unit, setUnit] = (0, import_react.useState)("kg");
	const [category, setCategory] = (0, import_react.useState)("Hortifruti");
	const invalidate = () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
	const fail = () => toast.error("Não deu para salvar. Tente de novo.");
	const addMutation = useMutation({
		mutationFn: createProduct,
		onSuccess: () => {
			invalidate();
			toast.success("Produto adicionado ao catálogo");
			setName("");
			setPrice("");
		},
		onError: fail
	});
	const updateMutation = useMutation({
		mutationFn: ({ id, patch }) => updateProduct(id, patch),
		onSuccess: invalidate,
		onError: fail
	});
	const deleteMutation = useMutation({
		mutationFn: deleteProduct,
		onSuccess: invalidate,
		onError: fail
	});
	function create() {
		const value = parseFloat(price.replace(",", "."));
		if (!name.trim() || !value) {
			toast.error("Escreva o nome e o preço do produto.");
			return;
		}
		addMutation.mutate({
			name: name.trim(),
			price: value,
			unit,
			category
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-extrabold",
					children: "Catálogo e preços"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Toque no botão de cada produto para alternar entre ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Disponível" }),
						" e ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Esgotado" }),
						"."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3 rounded-2xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-bold",
						children: "Novo produto"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "np-name",
								children: "Nome"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "np-name",
								value: name,
								onChange: (event) => setName(event.target.value),
								className: "h-12",
								placeholder: "Abobrinha"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "np-price",
								children: "Preço (R$)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "np-price",
								value: price,
								onChange: (event) => setPrice(event.target.value),
								className: "h-12",
								inputMode: "decimal",
								placeholder: "7,90"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: UNITS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: unit === option.value ? "hero" : "soft",
							onClick: () => setUnit(option.value),
							children: option.label
						}, option.value))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: CATEGORIES.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: category === option ? "hero" : "soft",
							onClick: () => setCategory(option),
							children: option
						}, option))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "hero",
						size: "xl",
						className: "w-full",
						onClick: create,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { "aria-hidden": true }), " Adicionar ao catálogo"]
					})
				]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Carregando produtos…"
			}) : null,
			CATEGORIES.map((cat) => {
				const list = products.filter((p) => p.category === cat);
				if (list.length === 0) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "rounded-xl bg-secondary px-3 py-2 text-sm font-bold uppercase tracking-wide text-secondary-foreground",
						children: cat
					}), list.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-40 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base font-bold",
									children: product.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground",
									children: [
										brl(product.price),
										" /",
										" ",
										product.unit === "kg" ? "kg" : product.unit === "pct" ? "pacote" : "unidade"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center rounded-xl border border-input bg-background px-2.5 shadow-sm focus-within:ring-2 focus-within:ring-ring",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-muted-foreground mr-1",
									children: "R$"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									"aria-label": `Preço de ${product.name}`,
									defaultValue: product.price.toFixed(2).replace(".", ","),
									inputMode: "decimal",
									className: "h-12 w-20 bg-transparent text-sm font-semibold focus:outline-none",
									onBlur: (event) => {
										const value = parseFloat(event.target.value.replace(",", "."));
										if (value && value !== product.price) updateMutation.mutate({
											id: product.id,
											patch: { price: value }
										});
									}
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: product.available ? "hero" : "destructive",
								size: "xl",
								onClick: () => updateMutation.mutate({
									id: product.id,
									patch: { available: !product.available }
								}),
								children: product.available ? "Disponível" : "Esgotado"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": `Remover ${product.name}`,
								onClick: () => deleteMutation.mutate(product.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { "aria-hidden": true })
							})
						]
					}, product.id))]
				}, cat);
			})
		]
	});
}
//#endregion
export { CatalogoPage as component };
