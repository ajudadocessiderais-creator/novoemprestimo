import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useLoanApplication } from "@/contexts/LoanApplicationContext";
import { Loader2 } from "lucide-react";

const logoUrl = "https://i.ibb.co/ymM889cK/Chat-GPT-Image-15-de-out-de-2025-19-27-41.png";

const Simulate = () => {
  const navigate = useNavigate();
  const { createApplication, loading } = useLoanApplication();
  const [amount, setAmount] = useState([1000]);
  const [selectedInstallments, setSelectedInstallments] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    address: "",
    profession: "",
    salary: "",
  });

  const interestRates: { [key: number]: number } = {
    3: 0.07,
    6: 0.13,
    9: 0.20,
    12: 0.30,
  };
  const monthlyInstallments = [3, 6, 9, 12];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.cpf) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (!selectedInstallments) {
      toast.error("Por favor, selecione o número de parcelas");
      return;
    }

    const selectedInterestRate = interestRates[selectedInstallments];
    const totalWithInterest = amount[0] * (1 + selectedInterestRate);
    const monthlyPayment = totalWithInterest / selectedInstallments;

    const applicationData = {
      requested_amount: amount[0],
      installments_option: selectedInstallments,
      monthly_payment: monthlyPayment,
      total_with_interest: totalWithInterest,
      interest_rate: selectedInterestRate,
      ...formData,
      salary: formData.salary || '0', // Ensure salary is a string
    };
    
    await createApplication(applicationData);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img 
            src={logoUrl} 
            alt="PixUp Empréstimos" 
            className="h-12 cursor-pointer" 
            onClick={() => navigate("/")}
          />
          <Button 
            variant="outline"
            onClick={() => navigate("/")}
          >
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 animate-fade-in">
            Simule seu Empréstimo Pessoal
          </h1>

          <Card className="mb-8 border-2 border-primary/20 shadow-elegant animate-slide-up">
            <CardHeader>
              <CardTitle>Quanto você precisa?</CardTitle>
              <CardDescription>Escolha o valor do empréstimo entre R$ 100 e R$ 2.500</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">
                    R$ {amount[0].toLocaleString("pt-BR")}
                  </p>
                </div>
                <Slider
                  value={amount}
                  onValueChange={setAmount}
                  min={100}
                  max={2500}
                  step={50}
                  className="w-full"
                  disabled={loading}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>R$ 100</span>
                  <span>R$ 2.500</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-3">Escolha o número de parcelas: *</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {monthlyInstallments.map((months) => {
                    const rate = interestRates[months];
                    const total = amount[0] * (1 + rate);
                    const monthlyPayment = total / months;
                    return (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setSelectedInstallments(months)}
                        disabled={loading}
                        className={`bg-card border-2 rounded-lg p-3 text-center transition-all hover:border-primary/50 ${
                          selectedInstallments === months 
                            ? "border-primary bg-primary/10" 
                            : "border-border"
                        }`}
                      >
                        <p className="text-sm text-muted-foreground">{months}x de</p>
                        <p className="font-bold text-primary">
                          R$ {monthlyPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 shadow-elegant animate-slide-up">
            <CardHeader>
              <CardTitle>Seus Dados Pessoais</CardTitle>
              <CardDescription>Preencha seus dados para continuar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Seu nome completo"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(00) 00000-0000"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      placeholder="000.000.000-00"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Rua, número, bairro, cidade, estado"
                    disabled={loading}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profissão</Label>
                    <Input
                      id="profession"
                      name="profession"
                      value={formData.profession}
                      onChange={handleInputChange}
                      placeholder="Sua profissão"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Renda Mensal</Label>
                    <Input
                      id="salary"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      placeholder="R$ 0,00"
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {loading ? "Enviando..." : "Continuar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Simulate;
