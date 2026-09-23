-- Migration para sincronizar a tabela order_items criada manualmente
-- Garante a estrutura com product_name/quantity/unit_price/total_price,
-- permissões completas para anon e authenticated, e recarregamento do schema cache do PostgREST.

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    quantity NUMERIC NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Permitir leitura para todos'
  ) THEN
    CREATE POLICY "Permitir leitura para todos" ON public.order_items FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Permitir inserção para todos'
  ) THEN
    CREATE POLICY "Permitir inserção para todos" ON public.order_items FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Garante as permissões de acesso para os papéis da API Supabase (necessário para o PostgREST incluir no schema cache)
GRANT ALL ON public.order_items TO anon, authenticated, service_role;

-- Notifica o PostgREST para recarregar o schema cache
NOTIFY pgrst, 'reload schema';
