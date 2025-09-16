import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center mb-6">
          <Package className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Sistema de Gestão
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Gerencie seu estoque de materiais de construção de forma simples e eficiente.
        </p>
        <div className="pt-4 space-y-3">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link to="/gestao-estoque">
              <Package className="h-4 w-4 mr-2" />
              Acessar Gestão de Estoque
            </Link>
          </Button>
          <div className="block sm:hidden" />
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link to="/produtos-populares">
              <TrendingUp className="h-4 w-4 mr-2" />
              Produtos Mais Procurados
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
