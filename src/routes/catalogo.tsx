import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORIES } from "@/lib/catalog";
import {
  PRODUCTS_KEY,
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "@/lib/data";
import { brl } from "@/lib/format";
import type { Category, Unit } from "@/lib/types";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Catálogo de Preços | Cebolão" },
      {
        name: "description",
        content:
          "Cadastro rápido de preços por kg, unidade ou pacote com botão de disponível e esgotado.",
      },
      { property: "og:title", content: "Catálogo de Preços | Cebolão" },
      {
        property: "og:description",
        content: "Atualize preços do hortifruti e da mercearia em poucos toques.",
      },
    ],
  }),
  component: CatalogoPage,
});

const UNITS: { value: Unit; label: string }[] = [
  { value: "kg", label: "por kg" },
  { value: "un", label: "unidade" },
  { value: "pct", label: "pacote" },
];

function CatalogoPage() {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: fetchProducts,
  });

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState<Unit>("kg");
  const [category, setCategory] = useState<Category>("Hortifruti");

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
    onError: fail,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: { price?: number; available?: boolean } }) =>
      updateProduct(id, patch),
    onSuccess: invalidate,
    onError: fail,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: invalidate,
    onError: fail,
  });

  function create() {
    const value = parseFloat(price.replace(",", "."));
    if (!name.trim() || !value) {
      toast.error("Escreva o nome e o preço do produto.");
      return;
    }
    addMutation.mutate({ name: name.trim(), price: value, unit, category });
  }

  return (
    <div className="space-y-5 pb-24">
      <header className="space-y-1">
        <h1 className="text-2xl font-extrabold">Catálogo e preços</h1>
        <p className="text-sm text-muted-foreground">
          Toque no botão de cada produto para alternar entre <strong>Disponível</strong> e <strong>Esgotado</strong>.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <p className="text-base font-bold">Novo produto</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="np-name">Nome</Label>
            <Input
              id="np-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-12"
              placeholder="Abobrinha"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="np-price">Preço (R$)</Label>
            <Input
              id="np-price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="h-12"
              inputMode="decimal"
              placeholder="7,90"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {UNITS.map((option) => (
            <Button
              key={option.value}
              variant={unit === option.value ? "hero" : "soft"}
              onClick={() => setUnit(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((option) => (
            <Button
              key={option}
              variant={category === option ? "hero" : "soft"}
              onClick={() => setCategory(option)}
            >
              {option}
            </Button>
          ))}
        </div>
        <Button variant="hero" size="xl" className="w-full" onClick={create}>
          <Plus aria-hidden /> Adicionar ao catálogo
        </Button>
      </section>

      {isLoading ? <p className="text-sm text-muted-foreground">Carregando produtos…</p> : null}

      {CATEGORIES.map((cat) => {
        const list = products.filter((p) => p.category === cat);
        if (list.length === 0) return null;
        return (
          <section key={cat} className="space-y-2">
            <h2 className="rounded-xl bg-secondary px-3 py-2 text-sm font-bold uppercase tracking-wide text-secondary-foreground">
              {cat}
            </h2>
            {list.map((product) => (
              <article
                key={product.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-3"
              >
                <div className="min-w-40 flex-1">
                  <p className="text-base font-bold">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {brl(product.price)} /{" "}
                    {product.unit === "kg" ? "kg" : product.unit === "pct" ? "pacote" : "unidade"}
                  </p>
                </div>
                <Input
                  aria-label={`Preço de ${product.name}`}
                  defaultValue={product.price.toFixed(2).replace(".", ",")}
                  inputMode="decimal"
                  className="h-12 w-24"
                  onBlur={(event) => {
                    const value = parseFloat(event.target.value.replace(",", "."));
                    if (value && value !== product.price) {
                      updateMutation.mutate({ id: product.id, patch: { price: value } });
                    }
                  }}
                />
                <Button
                  variant={product.available ? "hero" : "destructive"}
                  size="xl"
                  onClick={() =>
                    updateMutation.mutate({
                      id: product.id,
                      patch: { available: !product.available },
                    })
                  }
                >
                  {product.available ? "Disponível" : "Esgotado"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remover ${product.name}`}
                  onClick={() => deleteMutation.mutate(product.id)}
                >
                  <Trash2 aria-hidden />
                </Button>
              </article>
            ))}
          </section>
        );
      })}
    </div>
  );
}
