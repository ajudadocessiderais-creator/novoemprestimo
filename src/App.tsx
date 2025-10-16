import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Simulate from "./pages/Simulate";
import Approval from "./pages/Approval";
import Documents from "./pages/Documents";
import NotFound from "./pages/NotFound";
import { LoanApplicationProvider } from "./contexts/LoanApplicationContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LoanApplicationProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simular" element={<Simulate />} />
            <Route path="/aprovacao" element={<Approval />} />
            <Route path="/documentos" element={<Documents />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LoanApplicationProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
