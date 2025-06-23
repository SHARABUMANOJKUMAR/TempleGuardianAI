
import { Card } from '@/components/ui/card';
import { ChantingInfo } from './chanting/ChantingInfo';
import { ChantingProgress } from './chanting/ChantingProgress';
import { ChantingControls } from './chanting/ChantingControls';
import { VolumeControl } from './chanting/VolumeControl';
import { useChantingPlayer } from '@/hooks/useChantingPlayer';
import type { Temple } from '@/hooks/useTemples';

interface ChantingPlayerProps {
  temple: Temple;
}

// Enhanced chanting data with better spiritual music descriptions
const chantingData = [
  {
    id: 'om-namah-shivaya',
    title: 'Om Namah Shivaya',
    deity: 'Lord Shiva',
    duration: '5:30',
    url: 'devotional-shiva-chant'
  },
  {
    id: 'hare-krishna',
    title: 'Hare Krishna Maha Mantra',
    deity: 'Lord Krishna',
    duration: '8:15',
    url: 'devotional-krishna-chant'
  },
  {
    id: 'om-gam-ganapataye',
    title: 'Om Gam Ganapataye Namaha',
    deity: 'Lord Ganesha',
    duration: '3:45',
    url: 'devotional-ganesha-chant'
  },
  {
    id: 'aditya-hridayam',
    title: 'Aditya Hridayam',
    deity: 'Surya Dev',
    duration: '12:30',
    url: 'devotional-surya-chant'
  },
  {
    id: 'vishnu-sahasranamam',
    title: 'Vishnu Sahasranamam (Short)',
    deity: 'Lord Vishnu',
    duration: '7:20',
    url: 'devotional-vishnu-chant'
  }
];

export const ChantingPlayer = ({ temple }: ChantingPlayerProps) => {
  // Filter chants based on temple deity
  const getRelevantChants = () => {
    const deity = temple.deity.toLowerCase();
    let relevantChants = chantingData;

    if (deity.includes('shiva')) {
      relevantChants = chantingData.filter(chant => 
        chant.deity.includes('Shiva') || chant.id === 'om-namah-shivaya'
      );
    } else if (deity.includes('krishna') || deity.includes('vishnu')) {
      relevantChants = chantingData.filter(chant => 
        chant.deity.includes('Krishna') || chant.deity.includes('Vishnu')
      );
    } else if (deity.includes('ganesha') || deity.includes('ganapati')) {
      relevantChants = chantingData.filter(chant => 
        chant.deity.includes('Ganesha')
      );
    } else if (deity.includes('surya') || deity.includes('sun')) {
      relevantChants = chantingData.filter(chant => 
        chant.deity.includes('Surya')
      );
    }

    return relevantChants.length > 0 ? relevantChants : [chantingData[0]];
  };

  const relevantChants = getRelevantChants();
  
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    currentChantIndex,
    isLoading,
    currentChant,
    formatTime,
    togglePlayPause,
    handleSeek,
    handleVolumeChange,
    handleNext,
    handlePrevious
  } = useChantingPlayer({ chants: relevantChants });

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 w-full max-w-sm mx-auto">
      <ChantingInfo
        title={currentChant.title}
        deity={currentChant.deity}
        templeName={temple.name}
        isLoading={isLoading}
        currentIndex={currentChantIndex}
        totalChants={relevantChants.length}
      />
      
      <div className="px-4 pb-4 space-y-3">
        <ChantingProgress
          currentTime={currentTime}
          duration={duration}
          formatTime={formatTime}
          onSeek={handleSeek}
          isLoading={isLoading}
        />

        <ChantingControls
          isPlaying={isPlaying}
          isLoading={isLoading}
          onTogglePlayPause={togglePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />

        <VolumeControl
          volume={volume}
          onVolumeChange={handleVolumeChange}
        />
      </div>
    </Card>
  );
};
