
import { Slider } from '@/components/ui/slider';

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
  const handleSeek = (newTime: number[]) => {
    onSeek(newTime[0]);
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 px-2">
      <span className="text-xs text-amber-600 w-8 sm:w-10 text-left flex-shrink-0 font-mono">
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
      <span className="text-xs text-amber-600 w-8 sm:w-10 text-right flex-shrink-0 font-mono">
        {formatTime(duration)}
      </span>
    </div>
  );
};
