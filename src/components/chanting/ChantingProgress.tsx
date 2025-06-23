
import { Slider } from '@/components/ui/slider';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChantingProgressProps {
  currentTime: number;
  duration: number;
  formatTime: (time: number) => string;
  onSeek: (newTime: number) => void;
  isLoading: boolean;
}

export const ChantingProgress = ({ 
  currentTime, 
  duration, 
  formatTime, 
  onSeek, 
  isLoading 
}: ChantingProgressProps) => {
  const isMobile = useIsMobile();
  
  const handleSeek = (newTime: number[]) => {
    onSeek(newTime[0]);
  };

  return (
    <div className={`flex items-center gap-${isMobile ? '2' : '3'} px-2`}>
      <span className={`text-amber-600 ${isMobile ? 'w-6 text-xs' : 'w-8 text-xs'} text-left flex-shrink-0 font-mono`}>
        {formatTime(currentTime)}
      </span>
      <Slider
        value={[currentTime]}
        onValueChange={handleSeek}
        max={duration || 100}
        step={1}
        className="flex-1 min-w-0"
        disabled={isLoading}
      />
      <span className={`text-amber-600 ${isMobile ? 'w-6 text-xs' : 'w-8 text-xs'} text-right flex-shrink-0 font-mono`}>
        {formatTime(duration)}
      </span>
    </div>
  );
};
