
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

// Enhanced spiritual chanting collection with authentic mantras
const chantingData = [
  {
    id: 'om-namah-shivaya',
    title: 'ॐ नमः शिवाय',
    deity: 'Lord Shiva',
    duration: '5:30',
    url: 'devotional-shiva-chant'
  },
  {
    id: 'hare-krishna',
    title: 'हरे कृष्ण महामंत्र',
    deity: 'Lord Krishna',
    duration: '8:15',
    url: 'devotional-krishna-chant'
  },
  {
    id: 'om-gam-ganapataye',
    title: 'ॐ गं गणपतये नमः',
    deity: 'Lord Ganesha',
    duration: '3:45',
    url: 'devotional-ganesha-chant'
  },
  {
    id: 'aditya-hridayam',
    title: 'आदित्य हृदयम्',
    deity: 'Surya Dev',
    duration: '12:30',
    url: 'devotional-surya-chant'
  },
  {
    id: 'vishnu-sahasranamam',
    title: 'विष्णु सहस्रनाम',
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
    <div className="w-full max-w-sm mx-auto">
      <Card className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-300 shadow-xl backdrop-blur-sm">
        <div className="relative overflow-hidden">
          {/* Beautiful gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 opacity-70"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f59e0b" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          
          <div className="relative z-10">
            <ChantingInfo
              title={currentChant.title}
              deity={currentChant.deity}
              templeName={temple.name}
              isLoading={isLoading}
              currentIndex={currentChantIndex}
              totalChants={relevantChants.length}
            />
            
            <div className="px-3 sm:px-4 pb-4 space-y-4">
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

              {/* Spiritual message */}
              <div className="bg-gradient-to-r from-amber-200 to-orange-200 p-3 rounded-lg border border-amber-300 text-center">
                <p className="text-amber-900 text-xs leading-relaxed">
                  🕉️ Let the sacred vibrations purify your soul and connect you with the divine energy of {currentChant.deity}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
