
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
    <div className="flex items-center justify-center gap-2 px-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        className="border-amber-300 text-amber-700 hover:bg-amber-50 h-8 w-8 p-0"
        disabled={isLoading}
      >
        <SkipBack size={14} />
      </Button>
      
      <Button
        onClick={onTogglePlayPause}
        className="bg-amber-500 hover:bg-amber-600 text-white h-10 w-10 rounded-full p-0"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause size={16} />
        ) : (
          <Play size={16} />
        )}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        className="border-amber-300 text-amber-700 hover:bg-amber-50 h-8 w-8 p-0"
        disabled={isLoading}
      >
        <SkipForward size={14} />
      </Button>
    </div>
  );
};
