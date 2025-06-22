
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Volume2, SkipForward, SkipBack } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import type { Temple } from '@/hooks/useTemples';

interface ChantingPlayerProps {
  temple: Temple;
}

// Sample chanting data for different temples
const chantingData = [
  {
    id: 'om-namah-shivaya',
    title: 'Om Namah Shivaya',
    deity: 'Lord Shiva',
    duration: '5:30',
    url: 'https://www.soundjay.com/misc/sounds/temple-chant.mp3' // Placeholder
  },
  {
    id: 'hare-krishna',
    title: 'Hare Krishna Maha Mantra',
    deity: 'Lord Krishna',
    duration: '8:15',
    url: 'https://www.soundjay.com/misc/sounds/krishna-chant.mp3' // Placeholder
  },
  {
    id: 'om-gam-ganapataye',
    title: 'Om Gam Ganapataye Namaha',
    deity: 'Lord Ganesha',
    duration: '3:45',
    url: 'https://www.soundjay.com/misc/sounds/ganesha-chant.mp3' // Placeholder
  },
  {
    id: 'aditya-hridayam',
    title: 'Aditya Hridayam',
    deity: 'Surya Dev',
    duration: '12:30',
    url: 'https://www.soundjay.com/misc/sounds/surya-chant.mp3' // Placeholder
  },
  {
    id: 'vishnu-sahasranamam',
    title: 'Vishnu Sahasranamam (Short)',
    deity: 'Lord Vishnu',
    duration: '7:20',
    url: 'https://www.soundjay.com/misc/sounds/vishnu-chant.mp3' // Placeholder
  }
];

export const ChantingPlayer = ({ temple }: ChantingPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [currentChantIndex, setCurrentChantIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

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

    return relevantChants.length > 0 ? relevantChants : [chantingData[0]]; // Fallback to Om Namah Shivaya
  };

  const relevantChants = getRelevantChants();
  const currentChant = relevantChants[currentChantIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleNext);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleNext);
    };
  }, [currentChantIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // Since we don't have actual audio files, we'll simulate playback
      simulatePlayback();
    }
    setIsPlaying(!isPlaying);
  };

  const simulatePlayback = () => {
    // Simulate audio playback for demo purposes
    const totalSeconds = duration || 300; // 5 minutes default
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= totalSeconds) {
          clearInterval(interval);
          setIsPlaying(false);
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  const handleSeek = (newTime: number[]) => {
    const audio = audioRef.current;
    const seekTime = newTime[0];
    setCurrentTime(seekTime);
    if (audio) {
      audio.currentTime = seekTime;
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
  };

  const handleNext = () => {
    setCurrentChantIndex((prev) => 
      prev === relevantChants.length - 1 ? 0 : prev + 1
    );
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setCurrentChantIndex((prev) => 
      prev === 0 ? relevantChants.length - 1 : prev - 1
    );
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Set duration based on current chant
  useEffect(() => {
    const [minutes, seconds] = currentChant.duration.split(':').map(Number);
    setDuration(minutes * 60 + seconds);
    setCurrentTime(0);
  }, [currentChant]);

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
      <CardHeader>
        <CardTitle className="text-amber-900 flex items-center gap-2">
          🎵 Sacred Chanting - {temple.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <audio
          ref={audioRef}
          src={currentChant.url}
          preload="metadata"
        />

        <div className="text-center space-y-2">
          <h3 className="font-semibold text-amber-900">{currentChant.title}</h3>
          <p className="text-amber-700 text-sm">For {currentChant.deity}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-600 w-12">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              onValueChange={handleSeek}
              max={duration || 100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-amber-600 w-12">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <SkipBack size={16} />
            </Button>
            
            <Button
              onClick={togglePlayPause}
              className="bg-amber-500 hover:bg-amber-600 text-white w-12 h-12 rounded-full"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <SkipForward size={16} />
            </Button>
          </div>

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
        </div>

        {relevantChants.length > 1 && (
          <div className="text-center">
            <p className="text-xs text-amber-600">
              {currentChantIndex + 1} of {relevantChants.length} chants
            </p>
          </div>
        )}

        <div className="bg-amber-100 p-3 rounded-lg border border-amber-200">
          <p className="text-amber-800 text-xs">
            🙏 Listen to these sacred chants to enhance your spiritual connection with {temple.deity}. 
            Each mantra carries divine vibrations that purify the mind and soul.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
