
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

interface ChantingControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  onTogglePlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const ChantingControls = ({ 
  isPlaying, 
  isLoading, 
  onTogglePlayPause, 
  onNext, 
  onPrevious 
}: ChantingControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 px-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        className="border-amber-300 text-amber-700 hover:bg-amber-50 h-8 w-8 sm:h-9 sm:w-9 p-0 transition-all duration-200 hover:scale-105"
        disabled={isLoading}
      >
        <SkipBack size={14} />
      </Button>
      
      <Button
        onClick={onTogglePlayPause}
        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white h-12 w-12 sm:h-14 sm:w-14 rounded-full p-0 transition-all duration-200 hover:scale-110 shadow-lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause size={18} />
        ) : (
          <Play size={18} className="ml-0.5" />
        )}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        className="border-amber-300 text-amber-700 hover:bg-amber-50 h-8 w-8 sm:h-9 sm:w-9 p-0 transition-all duration-200 hover:scale-105"
        disabled={isLoading}
      >
        <SkipForward size={14} />
      </Button>
    </div>
  );
};
