
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
    <div className="flex items-center justify-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        className="border-amber-300 text-amber-700 hover:bg-amber-50"
        disabled={isLoading}
      >
        <SkipBack size={16} />
      </Button>
      
      <Button
        onClick={onTogglePlayPause}
        className="bg-amber-500 hover:bg-amber-600 text-white w-12 h-12 rounded-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause size={20} />
        ) : (
          <Play size={20} />
        )}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        className="border-amber-300 text-amber-700 hover:bg-amber-50"
        disabled={isLoading}
      >
        <SkipForward size={16} />
      </Button>
    </div>
  );
};
