
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface HeaderProps {
  onReset: () => void;
}

export const Header = ({ onReset }: HeaderProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🛕</div>
          <h2 className="text-xl font-semibold text-orange-900">
            Temple Guardian AI
          </h2>
        </div>
        <Button
          variant="outline"
          onClick={onReset}
          className="flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-50"
        >
          <Home size={16} />
          Home
        </Button>
      </div>
    </header>
  );
};
