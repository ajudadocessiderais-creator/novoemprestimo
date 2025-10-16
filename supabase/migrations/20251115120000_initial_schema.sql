/*
          # Criação do Schema Inicial para Aplicações de Empréstimo
          Este script cria a tabela principal `loan_applications` para armazenar os dados dos pedidos de empréstimo e configura o Supabase Storage para o upload de documentos.

          ## Query Description: [Este script é seguro para ser executado em um banco de dados vazio. Ele cria novas tabelas e configurações de armazenamento e não afeta dados existentes. As políticas de segurança (RLS) são permissivas para permitir o funcionamento da aplicação sem autenticação de usuário, o que é um risco de segurança em produção.]
          
          ## Metadata:
          - Schema-Category: ["Structural"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          - Tabela criada: `public.loan_applications`
          - Bucket de Storage criado: `documents`
          
          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [Yes]
          - Auth Requirements: [Nenhuma. As políticas permitem acesso anônimo, o que é inseguro para produção.]
          
          ## Performance Impact:
          - Indexes: [Índice de chave primária em `id`]
          - Triggers: [Nenhum]
          - Estimated Impact: [Baixo. A criação inicial da tabela não impacta a performance.]
          */

-- 1. Create loan_applications table
CREATE TABLE public.loan_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    cpf TEXT NOT NULL,
    address TEXT,
    profession TEXT,
    salary NUMERIC,
    requested_amount NUMERIC NOT NULL,
    approved_amount NUMERIC,
    selected_installments INTEGER,
    monthly_payment NUMERIC,
    status TEXT DEFAULT 'simulated',
    bank_name TEXT,
    bank_code TEXT,
    bank_agency TEXT,
    bank_account TEXT,
    bank_account_type TEXT,
    CONSTRAINT loan_applications_cpf_key UNIQUE (cpf)
);

COMMENT ON TABLE public.loan_applications IS 'Stores all data related to user loan applications.';
COMMENT ON COLUMN public.loan_applications.status IS 'The current status of the loan application (e.g., simulated, documents_pending, documents_submitted, approved, rejected).';

-- 2. Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

COMMENT ON BUCKET documents IS 'Stores user-uploaded documents like RG, proof of residence, etc.';

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for loan_applications table
-- WARNING: These policies are permissive and allow any anonymous user to perform these actions.
-- This is necessary for the app to function without user authentication.
-- For a production environment, you MUST implement user authentication and create stricter policies.

CREATE POLICY "Allow anonymous insert"
ON public.loan_applications
FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous select"
ON public.loan_applications
FOR SELECT TO anon
USING (true);

CREATE POLICY "Allow anonymous update"
ON public.loan_applications
FOR UPDATE TO anon
USING (true);

-- 5. Create RLS policies for documents storage bucket
-- WARNING: These policies allow any anonymous user to upload and view files.
-- This is a security risk. In production, you should use signed URLs or stricter policies tied to authenticated users.

CREATE POLICY "Allow anonymous document uploads"
ON storage.objects
FOR INSERT TO anon
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Allow anonymous document reads"
ON storage.objects
FOR SELECT TO anon
USING (bucket_id = 'documents');
