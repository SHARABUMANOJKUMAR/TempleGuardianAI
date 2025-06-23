
import { Slider } from '@/components/ui/slider';
import { Volume2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
  const isMobile = useIsMobile();
  
  const handleVolumeChange = (newVolume: number[]) => {
    onVolumeChange(newVolume[0]);
  };

  return (
    <div className={`flex items-center gap-${isMobile ? '2' : '3'} px-2`}>
      <Volume2 size={isMobile ? 14 : 16} className="text-amber-600 flex-shrink-0" />
      <Slider
        value={[volume]}
        onValueChange={handleVolumeChange}
        max={100}
        step={1}
        className="flex-1 min-w-0"
      />
      <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-amber-600 ${isMobile ? 'w-6' : 'w-10'} text-right flex-shrink-0 font-medium`}>
        {volume}%
      </span>
    </div>
  );
};
