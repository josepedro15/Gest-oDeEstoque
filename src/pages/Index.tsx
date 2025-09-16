import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

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
        <div className="pt-4">
          <Button asChild size="lg">
            <Link to="/gestao-estoque">
              Acessar Gestão de Estoque
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
