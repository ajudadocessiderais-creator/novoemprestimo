import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, FileText, Home, DollarSign, Calendar, HelpCircle, User, CreditCard, Landmark, Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import { useLoanApplication } from "@/contexts/LoanApplicationContext";

const logoUrl = "https://i.ibb.co/ymM889cK/Chat-GPT-Image-15-de-out-de-2025-19-27-41.png";
const selfieExampleUrl = "https://i.ibb.co/Rpschdpn/Generated-Image-October-15-2025-10-38-PM-1.png";

const banks = [
    { value: "001", label: "001 - Banco do Brasil" },
    { value: "237", label: "237 - Bradesco" },
    { value: "341", label: "341 - Itaú Unibanco" },
    { value: "104", label: "104 - Caixa Econômica Federal" },
    { value: "033", label: "033 - Santander" },
    { value: "260", label: "260 - Nubank" },
    { value: "077", label: "077 - Banco Inter" },
    { value: "336", label: "336 - Banco C6" },
    { value: "745", label: "745 - Citibank" },
    { value: "422", label: "422 - Banco Safra" },
    { value: "outros", label: "Outros" },
];

type DocumentFiles = {
  rgFront: File | null;
  rgBack: File | null;
  selfieWithRg: File | null;
  proofOfResidence: File | null;
  proofOfIncome: File | null;
};

const Documents = () => {
  const navigate = useNavigate();
  const { applicationId, applicationData, updateApplication, uploadFile, loading, setApplicationId } = useLoanApplication();
  
  const [documents, setDocuments] = useState<DocumentFiles>({
    rgFront: null,
    rgBack: null,
    selfieWithRg: null,
    proofOfResidence: null,
    proofOfIncome: null,
  });
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [showSelfieHelp, setShowSelfieHelp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherBankFields, setShowOtherBankFields] = useState(false);
  const [bankData, setBankData] = useState({
    bank: "",
    agency: "",
    account: "",
    accountType: "",
    otherBankCode: "",
    otherBankName: "",
  });

  useEffect(() => {
    if (!applicationId) {
      toast.error("Nenhuma simulação encontrada. Por favor, comece novamente.");
      navigate("/simular");
    }
  }, [applicationId, navigate]);

  const handleFileChange = (field: keyof DocumentFiles) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments({
        ...documents,
        [field]: e.target.files[0],
      });
    }
  };

  const handleBankDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankData({
      ...bankData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBankSelectChange = (value: string) => {
    setBankData(prev => ({ ...prev, bank: value }));
    if (value === 'outros') {
      setShowOtherBankFields(true);
    } else {
      setShowOtherBankFields(false);
    }
  };

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error("Erro ao acessar a câmera: ", err);
      toast.error("Não foi possível acessar a câmera. Verifique as permissões do seu navegador.");
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
            setSelfieFile(file);
            toast.success("Selfie capturada com sucesso!");
          }
        }, 'image/jpeg');
      }
      closeCamera();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredDocs: (keyof DocumentFiles)[] = ['rgFront', 'rgBack', 'selfieWithRg', 'proofOfResidence', 'proofOfIncome'];
    for (const doc of requiredDocs) {
      if (!documents[doc]) {
        toast.error("Por favor, envie todos os documentos.");
        return;
      }
    }
    if (!selfieFile) {
      toast.error("Por favor, capture sua selfie.");
      return;
    }

    if (!bankData.bank || !bankData.agency || !bankData.account || !bankData.accountType) {
      toast.error("Por favor, preencha todos os seus dados bancários.");
      return;
    }

    if (bankData.bank === 'outros' && (!bankData.otherBankCode || !bankData.otherBankName)) {
        toast.error("Por favor, informe o código e o nome do seu banco.");
        return;
    }

    setIsSubmitting(true);

    try {
      const fileUploads = [
        uploadFile(documents.rgFront!, 'rg_front'),
        uploadFile(documents.rgBack!, 'rg_back'),
        uploadFile(documents.selfieWithRg!, 'selfie_with_rg'),
        uploadFile(documents.proofOfResidence!, 'proof_of_residence'),
        uploadFile(documents.proofOfIncome!, 'proof_of_income'),
        uploadFile(selfieFile, 'selfie'),
      ];

      const urls = await Promise.all(fileUploads);
      if (urls.some(url => url === null)) {
        throw new Error("Falha no upload de um ou mais arquivos.");
      }

      const [rgFrontUrl, rgBackUrl, selfieWithRgUrl, proofOfResidenceUrl, proofOfIncomeUrl, selfieUrl] = urls;

      const selectedBank = banks.find(b => b.value === bankData.bank);

      const finalBankData = {
        bank_name: bankData.bank === 'outros' ? bankData.otherBankName : selectedBank?.label.split(' - ')[1],
        bank_code: bankData.bank === 'outros' ? bankData.otherBankCode : selectedBank?.value,
        bank_agency: bankData.agency,
        bank_account: bankData.account,
        bank_account_type: bankData.accountType,
      };

      await updateApplication({
        ...finalBankData,
        rg_front_url: rgFrontUrl,
        rg_back_url: rgBackUrl,
        selfie_with_rg_url: selfieWithRgUrl,
        proof_of_residence_url: proofOfResidenceUrl,
        proof_of_income_url: proofOfIncomeUrl,
        selfie_url: selfieUrl,
        status: 'documents_submitted'
      });

      toast.success("Documentos enviados para análise! Assim que aprovado, o dinheiro cai na hora.");
      setApplicationId(null); // Clear session
      setTimeout(() => navigate("/"), 3000);

    } catch (error) {
      toast.error("Ocorreu um erro ao enviar seus documentos. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-4xl font-bold text-center mb-4 animate-fade-in">
            Envie seus Documentos
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Para finalizar seu empréstimo, precisamos validar alguns documentos e seus dados bancários.
          </p>

          {applicationData && (
            <>
              <Card className="mb-8 border-2 border-primary/20 shadow-elegant animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Seus Dados Pessoais
                  </CardTitle>
                  <CardDescription>Revise seus dados cadastrados. Eles não podem ser alterados nesta etapa.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="readOnlyName">Nome Completo</Label>
                      <Input id="readOnlyName" value={applicationData.name || ''} readOnly disabled className="bg-muted/50" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="readOnlyEmail">E-mail</Label>
                      <Input id="readOnlyEmail" value={applicationData.email || ''} readOnly disabled className="bg-muted/50" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="readOnlyPhone">Telefone</Label>
                      <Input id="readOnlyPhone" value={applicationData.phone || ''} readOnly disabled className="bg-muted/50" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="readOnlyCpf">CPF</Label>
                      <Input id="readOnlyCpf" value={applicationData.cpf || ''} readOnly disabled className="bg-muted/50" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8 border-2 border-primary/20 shadow-elegant animate-fade-in bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Resumo do seu Empréstimo
                  </CardTitle>
                  <CardDescription>Confira os detalhes do seu pedido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2"><DollarSign className="h-4 w-4" /> Valor Aprovado</span>
                    <span className="font-bold text-lg text-primary">R$ {applicationData.approved_amount?.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> Parcelas</span>
                    <span className="font-semibold">{applicationData.installments_option}x de R$ {applicationData.monthly_payment?.toLocaleString('pt-BR')}</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-2 border-primary/20 shadow-elegant animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Documento de Identidade (RG)
                </CardTitle>
                <CardDescription>Envie fotos nítidas do seu RG e uma foto do seu rosto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rgFront">RG - Frente *</Label>
                    <Input id="rgFront" type="file" accept="image/*" onChange={handleFileChange("rgFront")} className="cursor-pointer" required />
                    {documents.rgFront && <p className="text-xs text-primary mt-1">✓ {documents.rgFront.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rgBack">RG - Verso *</Label>
                    <Input id="rgBack" type="file" accept="image/*" onChange={handleFileChange("rgBack")} className="cursor-pointer" required />
                    {documents.rgBack && <p className="text-xs text-primary mt-1">✓ {documents.rgBack.name}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selfie">Selfie *</Label>
                  <Button type="button" variant="outline" onClick={openCamera} className="w-full justify-start">
                    <Camera className="mr-2 h-4 w-4" />
                    Enviar Foto
                  </Button>
                  {selfieFile && <p className="text-xs text-primary mt-1">✓ Selfie capturada: {selfieFile.name}</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="selfieWithRg">Selfie segurando o RG *</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowSelfieHelp(true)} className="h-7 px-2 text-xs">
                      <HelpCircle className="h-3 w-3 mr-1" /> Formato Correto
                    </Button>
                  </div>
                  <Input id="selfieWithRg" type="file" accept="image/*" onChange={handleFileChange("selfieWithRg")} className="cursor-pointer" required />
                  {documents.selfieWithRg && <p className="text-xs text-primary mt-1">✓ {documents.selfieWithRg.name}</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 shadow-elegant animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Comprovante de Residência
                </CardTitle>
                <CardDescription>Conta de luz, água ou telefone recente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="proofOfResidence">Comprovante de Residência *</Label>
                  <Input id="proofOfResidence" type="file" accept="image/*,.pdf" onChange={handleFileChange("proofOfResidence")} className="cursor-pointer" required />
                  {documents.proofOfResidence && <p className="text-xs text-primary mt-1">✓ {documents.proofOfResidence.name}</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 shadow-elegant animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Comprovante de Renda
                </CardTitle>
                <CardDescription>Holerite, extrato bancário ou declaração de IR</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="proofOfIncome">Comprovante de Renda *</Label>
                  <Input id="proofOfIncome" type="file" accept="image/*,.pdf" onChange={handleFileChange("proofOfIncome")} className="cursor-pointer" required />
                  {documents.proofOfIncome && <p className="text-xs text-primary mt-1">✓ {documents.proofOfIncome.name}</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 shadow-elegant animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-primary" />
                  Dados Bancários para Recebimento
                </CardTitle>
                <CardDescription>Informe a conta onde o dinheiro será depositado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bank">Banco *</Label>
                  <Select onValueChange={handleBankSelectChange} required>
                    <SelectTrigger id="bank">
                      <SelectValue placeholder="Selecione seu banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                {showOtherBankFields && (
                  <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="otherBankCode">Código do Banco *</Label>
                      <Input id="otherBankCode" name="otherBankCode" value={bankData.otherBankCode} onChange={handleBankDataChange} placeholder="Ex: 123" required={showOtherBankFields} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherBankName">Nome do Banco *</Label>
                      <Input id="otherBankName" name="otherBankName" value={bankData.otherBankName} onChange={handleBankDataChange} placeholder="Ex: Meu Banco Digital" required={showOtherBankFields} />
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agency">Agência *</Label>
                    <Input id="agency" name="agency" value={bankData.agency} onChange={handleBankDataChange} placeholder="Ex: 0001" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account">Conta com dígito *</Label>
                    <Input id="account" name="account" value={bankData.account} onChange={handleBankDataChange} placeholder="Ex: 12345-6" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Conta *</Label>
                  <RadioGroup onValueChange={(value) => setBankData(prev => ({...prev, accountType: value}))} className="flex gap-4" required>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="corrente" id="corrente" />
                      <Label htmlFor="corrente">Conta Corrente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="poupanca" id="poupanca" />
                      <Label htmlFor="poupanca">Conta Poupança</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={isSubmitting || loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6">
              {(isSubmitting || loading) ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Upload className="mr-2 h-5 w-5" />
              )}
              {(isSubmitting || loading) ? "Enviando..." : "Enviar para Análise"}
            </Button>
          </form>
        </div>
      </div>
      
      <Dialog open={showSelfieHelp} onOpenChange={setShowSelfieHelp}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Formato Correto da Selfie</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <img 
              src={selfieExampleUrl}
              alt="Exemplo de selfie com RG" 
              className="w-full max-w-xs rounded-lg border-2 border-primary/20"
            />
            <p className="text-sm text-muted-foreground text-center">
              Tire uma selfie segurando seu RG próximo ao rosto, garantindo que seu rosto e o documento estejam visíveis e nítidos.
            </p>
            <Button onClick={() => setShowSelfieHelp(false)} className="w-full">
              Entendi
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCamera} onOpenChange={(isOpen) => !isOpen && closeCamera()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Captura de Selfie</DialogTitle>
            <DialogDescription>Centralize seu rosto no vídeo e tire a foto.</DialogDescription>
          </DialogHeader>
          <div className="relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-md" />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <Button onClick={handleCapture} className="w-full">
            <Camera className="mr-2 h-4 w-4" />
            Tirar Foto
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
