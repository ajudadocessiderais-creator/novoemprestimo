import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Shield, Clock, CheckCircle2 } from "lucide-react";

const logoUrl = "https://i.ibb.co/ymM889cK/Chat-GPT-Image-15-de-out-de-2025-19-27-41.png";
const bannerHomeUrl = "https://i.ibb.co/Rpschdpn/Generated-Image-October-15-2025-10-38-PM-1.png";

const features = [
  {
    title: "PIX na Hora",
    description: "Rápido e descomplicado, dinheiro em instantes.",
    icon: <Clock className="h-10 w-10 text-white" />,
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Inclusão para todos",
    description: "Oferta também para negativados.",
    icon: <CheckCircle2 className="h-10 w-10 text-white" />,
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Juros reduzidos",
    description: "Flexibilidade nos próximos empréstimos.",
    icon: <Shield className="h-10 w-10 text-white" />,
    image: "https://images.unsplash.com/photo-1561414927-6d86591d0c4f?q=80&w=2070&auto=format&fit=crop",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img src={logoUrl} alt="PixUp Empréstimos" className="h-12" />
          <Button
            onClick={() => navigate("/simular")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
          >
            Simular Empréstimo
          </Button>
        </div>
      </header>

      {/* Banner */}
      <div className="w-full overflow-hidden">
        <img src={bannerHomeUrl} alt="PixUp Empréstimos - Banner" className="w-full h-auto object-cover" />
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 pt-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Empréstimo Pessoal Online com
              <span className="text-primary"> maior taxa de aprovação</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Para cada desafio, um SIM! Democrático, rápido e sem burocracias
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/simular")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-12 py-6 shadow-elegant"
              >
                Simular Agora
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="mt-6 text-2xl font-bold text-primary">Empréstimo de até R$ 2.500!</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">ESPECIAL PRA VOCÊ</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative group aspect-[16/9] md:aspect-[3/1] w-full overflow-hidden rounded-xl shadow-lg">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <CardContent className="relative z-10 flex flex-col justify-end h-full p-6 md:p-10 text-white">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-3xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-lg text-white/80 max-w-md">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary via-primary/95 to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">SEM SEGREDO</h2>
          <p className="text-xl text-primary-foreground/90 mb-4 max-w-2xl mx-auto">
            Empréstimo Pessoal Online diferente do que tem por aí!
          </p>
          <p className="text-primary-foreground/80 mb-8 max-w-3xl mx-auto">
            Deixe seu pedido no nosso processo que pode e deveria ser simples como é. Na PixUp utilizamos tecnologia
            avançada para analisar seu perfil de forma justa, aumentando suas chances de aprovação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/simular")}
              className="bg-white hover:bg-white/90 text-primary font-bold text-lg px-12 py-6"
            >
              Solicitar empréstimo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p className="mb-4">© 2025 PixUp Empréstimos. Todos os direitos reservados.</p>
          <div className="space-y-1">
            <p>Razão Social: Pixup Servicos e Intermediacoes LTDA</p>
            <p>CNPJ: 59.667.922/0001-08</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
