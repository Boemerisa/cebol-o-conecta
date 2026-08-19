CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  unit text NOT NULL DEFAULT 'un',
  price numeric(10,2) NOT NULL DEFAULT 0,
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE SEQUENCE public.order_number_seq START 1;

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number integer NOT NULL DEFAULT nextval('public.order_number_seq'),
  customer_phone text NOT NULL DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'pix',
  cash_for numeric(10,2),
  change_amount numeric(10,2),
  address jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'novo',
  checked text[] NOT NULL DEFAULT '{}',
  source text NOT NULL DEFAULT 'balcao',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO anon, authenticated;
GRANT USAGE ON SEQUENCE public.order_number_seq TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON SEQUENCE public.order_number_seq TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_public_all" ON public.products FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "orders_public_all" ON public.orders FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

INSERT INTO public.products (name, category, unit, price) VALUES
  ('Banana Prata', 'Hortifruti', 'kg', 6.99),
  ('Tomate', 'Hortifruti', 'kg', 8.49),
  ('Batata Inglesa', 'Hortifruti', 'kg', 5.79),
  ('Cebola', 'Hortifruti', 'kg', 4.99),
  ('Alface Crespa (pé)', 'Hortifruti', 'un', 3.50),
  ('Cenoura', 'Hortifruti', 'kg', 5.49),
  ('Maçã Gala', 'Hortifruti', 'kg', 9.90),
  ('Laranja Pera', 'Hortifruti', 'kg', 4.29),
  ('Mamão Formosa', 'Hortifruti', 'kg', 7.90),
  ('Arroz Tio João 5kg', 'Mercearia', 'pct', 27.90),
  ('Feijão Carioca 1kg', 'Mercearia', 'pct', 8.49),
  ('Óleo de Soja Liza 900ml', 'Mercearia', 'un', 7.29),
  ('Açúcar Refinado 1kg', 'Mercearia', 'pct', 4.79),
  ('Café Torrado 500g', 'Mercearia', 'pct', 16.90),
  ('Macarrão Espaguete 500g', 'Mercearia', 'pct', 4.59),
  ('Leite Integral 1L', 'Laticínios e Frios', 'un', 5.49),
  ('Queijo Mussarela', 'Laticínios e Frios', 'kg', 44.90),
  ('Presunto Fatiado', 'Laticínios e Frios', 'kg', 32.90),
  ('Ovos (dúzia)', 'Laticínios e Frios', 'un', 12.90),
  ('Refrigerante Cola 2L', 'Bebidas', 'un', 9.99),
  ('Água Mineral 1,5L', 'Bebidas', 'un', 3.49),
  ('Cerveja Lata 350ml', 'Bebidas', 'un', 4.29),
  ('Detergente 500ml', 'Limpeza', 'un', 2.99),
  ('Sabão em Pó 1kg', 'Limpeza', 'pct', 12.50),
  ('Papel Higiênico 4 rolos', 'Limpeza', 'pct', 8.90);

INSERT INTO public.orders (customer_phone, items, subtotal, delivery_fee, total, payment_method, cash_for, change_amount, address, status, source) VALUES
  ('11987654321',
   '[{"name":"Tomate","qty":1,"unit":"kg","unitPrice":8.49,"total":8.49},{"name":"Alface Crespa (pé)","qty":2,"unit":"un","unitPrice":3.5,"total":7.0},{"name":"Óleo de Soja Liza 900ml","qty":1,"unit":"un","unitPrice":7.29,"total":7.29},{"name":"Cebola","qty":0.5,"unit":"kg","unitPrice":4.99,"total":2.5}]'::jsonb,
   25.28, 5.00, 30.28, 'cash', 50.00, 19.72,
   '{"street":"Rua das Palmeiras","number":"120","neighborhood":"Centro","complement":"Apto 22","reference":"Perto da praça","receiver":"Dona Marta"}'::jsonb,
   'novo', 'balcao'),
  ('11991234567',
   '[{"name":"Arroz Tio João 5kg","qty":1,"unit":"pct","unitPrice":27.9,"total":27.9},{"name":"Feijão Carioca 1kg","qty":2,"unit":"pct","unitPrice":8.49,"total":16.98},{"name":"Leite Integral 1L","qty":6,"unit":"un","unitPrice":5.49,"total":32.94}]'::jsonb,
   77.82, 7.00, 84.82, 'pix', NULL, NULL,
   '{"street":"Rua Sete de Setembro","number":"455","neighborhood":"Vila Nova","complement":"","reference":"Portão azul","receiver":"Seu Antônio"}'::jsonb,
   'separacao', 'balcao'),
  ('11996667777',
   '[{"name":"Banana Prata","qty":2,"unit":"kg","unitPrice":6.99,"total":13.98},{"name":"Queijo Mussarela","qty":0.3,"unit":"kg","unitPrice":44.9,"total":13.47},{"name":"Refrigerante Cola 2L","qty":1,"unit":"un","unitPrice":9.99,"total":9.99}]'::jsonb,
   37.44, 8.00, 45.44, 'card', NULL, NULL,
   '{"street":"Av. das Flores","number":"88","neighborhood":"Jardim das Flores","complement":"Casa 2","reference":"Ao lado da padaria","receiver":"Juliana"}'::jsonb,
   'entrega', 'balcao');