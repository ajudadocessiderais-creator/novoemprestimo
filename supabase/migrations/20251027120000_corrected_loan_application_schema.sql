/*
          # Criação do Schema de Aplicação de Empréstimo
          Este script cria a tabela 'loan_applications' para armazenar os dados dos formulários e um bucket 'documents' para os arquivos.

          ## Query Description: Este script é seguro para ser executado em um banco de dados novo ou vazio. Ele cria uma nova tabela e um novo bucket de armazenamento. Nenhuma estrutura ou dado existente será alterado ou removido. As políticas de segurança (RLS) são permissivas para facilitar o desenvolvimento inicial, mas devem ser revisadas e ajustadas para produção, especialmente após a implementação da autenticação de usuários.

          ## Metadata:
          - Schema-Category: ["Structural"]
          - Impact-Level: ["Low"]
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Tabela Adicionada: `public.loan_applications`
          - Bucket Adicionado: `storage.documents`
          
          ## Security Implications:
          - RLS Status: Habilitado na tabela `loan_applications`.
          - Policy Changes: Sim, políticas de acesso público para inserção e seleção são adicionadas à tabela e ao bucket.
          - Auth Requirements: Nenhuma autenticação é necessária para as políticas atuais. Recomenda-se fortemente adicionar autenticação para produção.
          
          ## Performance Impact:
          - Indexes: Um índice de chave primária é adicionado em `id`.
          - Triggers: Nenhum.
          - Estimated Impact: Nenhum impacto em performance, pois as estruturas são novas.
          */

-- 1. Create loan_applications table
CREATE TABLE
  public.loan_applications (
    id UUID DEFAULT gen_random_uuid () NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    requested_amount REAL NULL,
    selected_installments SMALLINT NULL,
    monthly_payment REAL NULL,
    total_with_interest REAL NULL,
    interest_rate REAL NULL,
    name VARCHAR NULL,
    email VARCHAR NULL,
    phone VARCHAR NULL,
    cpf VARCHAR NULL,
    address VARCHAR NULL,
    profession VARCHAR NULL,
    salary VARCHAR NULL,
    approved_amount REAL NULL,
    bank_code VARCHAR NULL,
    bank_name VARCHAR NULL,
    bank_agency VARCHAR NULL,
    bank_account VARCHAR NULL,
    bank_account_type VARCHAR NULL,
    rg_front_url TEXT NULL,
    rg_back_url TEXT NULL,
    selfie_with_rg_url TEXT NULL,
    proof_of_residence_url TEXT NULL,
    proof_of_income_url TEXT NULL,
    selfie_url TEXT NULL,
    status VARCHAR DEFAULT 'pending' NOT NULL,
    CONSTRAINT loan_applications_pkey PRIMARY KEY (id)
  );

-- 2. Set up Row Level Security (RLS)
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public applications are viewable by everyone." ON public.loan_applications FOR
SELECT
  USING (true);

CREATE POLICY "Users can insert their own applications." ON public.loan_applications FOR INSERT
WITH
  CHECK (true);

-- 3. Create a bucket for documents
INSERT INTO
  storage.buckets (id, name, public)
VALUES
  ('documents', 'documents', true) ON CONFLICT (id) DO NOTHING;

-- 4. Set up security policies for the documents bucket
CREATE POLICY "Allow public read access to documents" ON storage.objects FOR
SELECT
  USING (bucket_id = 'documents');

CREATE POLICY "Allow anonymous users to upload documents" ON storage.objects FOR INSERT
WITH
  CHECK (bucket_id = 'documents');
