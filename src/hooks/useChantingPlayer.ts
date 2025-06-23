
import { useState, useRef, useEffect } from 'react';

interface ChantData {
  id: string;
  title: string;
  deity: string;
  duration: string;
  url: string;
}

interface UseChantingPlayerProps {
  chants: ChantData[];
  initialVolume?: number;
}

export const useChantingPlayer = ({ chants, initialVolume = 70 }: UseChantingPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(initialVolume);
  const [currentChantIndex, setCurrentChantIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const currentChant = chants[currentChantIndex];

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const stopCurrentAudio = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (error) {
        // Oscillator already stopped
      }
      oscillatorRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      stopCurrentAudio();
      setIsPlaying(false);
    } else {
      try {
        setIsLoading(true);
        
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(volume / 100 * 0.3, audioContext.currentTime);
        
        audioContextRef.current = audioContext;
        oscillatorRef.current = oscillator;
        gainNodeRef.current = gainNode;
        
        oscillator.start();
        
        setIsPlaying(true);
        setIsLoading(false);
        
        intervalRef.current = setInterval(() => {
          setCurrentTime(prev => {
            const newTime = prev + 1;
            if (newTime >= duration) {
              setIsPlaying(false);
              handleNext();
              stopCurrentAudio();
              return 0;
            }
            return newTime;
          });
        }, 1000);
        
        setTimeout(() => {
          if (oscillatorRef.current) {
            try {
              oscillatorRef.current.stop();
            } catch (error) {
              // Already stopped
            }
          }
        }, duration * 1000);
        
      } catch (error) {
        console.error('Audio playback failed:', error);
        setIsLoading(false);
      }
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVolume / 100 * 0.3, audioContextRef.current?.currentTime || 0);
    }
  };

  const handleNext = () => {
    stopCurrentAudio();
    setCurrentChantIndex((prev) => 
      prev === chants.length - 1 ? 0 : prev + 1
    );
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    stopCurrentAudio();
    setCurrentChantIndex((prev) => 
      prev === 0 ? chants.length - 1 : prev - 1
    );
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Set duration when chant changes
  useEffect(() => {
    const [minutes, seconds] = currentChant.duration.split(':').map(Number);
    setDuration(minutes * 60 + seconds);
    setCurrentTime(0);
  }, [currentChant]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCurrentAudio();
    };
  }, []);

  return {
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
  };
};
