
import { Slider } from '@/components/ui/slider';
import { Volume2 } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
  const handleVolumeChange = (newVolume: number[]) => {
    onVolumeChange(newVolume[0]);
  };

  return (
    <div className="flex items-center gap-2">
      <Volume2 size={16} className="text-amber-600" />
      <Slider
        value={[volume]}
        onValueChange={handleVolumeChange}
        max={100}
        step={1}
        className="flex-1"
      />
      <span className="text-xs text-amber-600 w-8">{volume}%</span>
    </div>
  );
};
