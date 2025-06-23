
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex items-center justify-center gap-${isMobile ? '2' : '4'} px-2`}>
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        className={`border-amber-300 text-amber-700 hover:bg-amber-50 ${isMobile ? 'h-8 w-8' : 'h-9 w-9'} p-0 transition-all duration-200 hover:scale-105`}
        disabled={isLoading}
      >
        <SkipBack size={isMobile ? 12 : 14} />
      </Button>
      
      <Button
        onClick={onTogglePlayPause}
        className={`bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white ${isMobile ? 'h-12 w-12' : 'h-14 w-14'} rounded-full p-0 transition-all duration-200 hover:scale-110 shadow-lg`}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} border-2 border-white border-t-transparent rounded-full animate-spin`} />
        ) : isPlaying ? (
          <Pause size={isMobile ? 16 : 18} />
        ) : (
          <Play size={isMobile ? 16 : 18} className="ml-0.5" />
        )}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        className={`border-amber-300 text-amber-700 hover:bg-amber-50 ${isMobile ? 'h-8 w-8' : 'h-9 w-9'} p-0 transition-all duration-200 hover:scale-105`}
        disabled={isLoading}
      >
        <SkipForward size={isMobile ? 12 : 14} />
      </Button>
    </div>
  );
};
