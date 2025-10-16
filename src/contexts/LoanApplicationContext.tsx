import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface LoanApplication {
  id?: string;
  created_at?: string;
  requested_amount?: number;
  installments_option?: number;
  monthly_payment?: number;
  total_with_interest?: number;
  interest_rate?: number;
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  address?: string;
  profession?: string;
  salary?: string;
  approved_amount?: number;
  status?: string;
  rg_front_url?: string;
  rg_back_url?: string;
  selfie_with_rg_url?: string;
  proof_of_residence_url?: string;
  proof_of_income_url?: string;
  selfie_url?: string;
  bank_name?: string;
  bank_agency?: string;
  bank_account?: string;
  bank_account_type?: string;
  bank_code?: string;
}

interface LoanApplicationContextType {
  applicationId: string | null;
  applicationData: LoanApplication | null;
  loading: boolean;
  createApplication: (data: Partial<LoanApplication>) => Promise<void>;
  updateApplication: (data: Partial<LoanApplication>) => Promise<void>;
  uploadFile: (file: File, fileName: string) => Promise<string | null>;
  setApplicationId: (id: string | null) => void;
}

const LoanApplicationContext = createContext<LoanApplicationContextType | undefined>(undefined);

export const LoanApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [applicationId, setApplicationIdState] = useState<string | null>(() => {
    return localStorage.getItem('loanApplicationId');
  });
  const [applicationData, setApplicationData] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setApplicationId = (id: string | null) => {
    setApplicationIdState(id);
    if (id) {
      localStorage.setItem('loanApplicationId', id);
    } else {
      localStorage.removeItem('loanApplicationId');
    }
  };

  useEffect(() => {
    if (applicationId && !applicationData) {
      fetchApplication(applicationId);
    }
  }, [applicationId]);

  const fetchApplication = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setApplicationData(data);
    } catch (error: any) {
      toast.error('Erro ao buscar dados da aplicação.');
      console.error('Error fetching application:', error);
      setApplicationId(null); // Clear invalid ID
      navigate('/simular');
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async (formData: Partial<LoanApplication>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .insert([{ ...formData, status: 'simulated' }])
        .select()
        .single();
      
      if (error) throw error;

      if (data) {
        setApplicationId(data.id);
        setApplicationData(data);
        toast.success('Simulação enviada! Analisando seu pedido...');
        navigate('/aprovacao');
      }
    } catch (error: any) {
      toast.error('Erro ao criar simulação.');
      console.error('Error creating application:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplication = async (updateData: Partial<LoanApplication>) => {
    if (!applicationId) {
      toast.error('ID da aplicação não encontrado.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .update(updateData)
        .eq('id', applicationId)
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setApplicationData(data[0]);
      } else {
        // The update was likely successful, but RLS might prevent reading the updated row.
        // We'll merge the changes locally to keep the state consistent.
        setApplicationData(prevData => prevData ? { ...prevData, ...updateData } : null);
      }
    } catch (error: any) {
      toast.error('Erro ao atualizar aplicação.');
      console.error('Error updating application:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, fileName: string): Promise<string | null> => {
    if (!applicationId) {
      toast.error("ID da aplicação não encontrado para fazer o upload.");
      return null;
    }
    
    const filePath = `${applicationId}/${fileName}_${Date.now()}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      return urlData.publicUrl;

    } catch (error: any) {
      toast.error(`Erro ao fazer upload do arquivo: ${fileName}`);
      console.error('File upload error:', error);
      return null;
    }
  };

  return (
    <LoanApplicationContext.Provider value={{ applicationId, applicationData, loading, createApplication, updateApplication, uploadFile, setApplicationId }}>
      {children}
    </LoanApplicationContext.Provider>
  );
};

export const useLoanApplication = () => {
  const context = useContext(LoanApplicationContext);
  if (context === undefined) {
    throw new Error('useLoanApplication must be used within a LoanApplicationProvider');
  }
  return context;
};
