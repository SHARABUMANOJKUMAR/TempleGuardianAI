
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
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  const currentChant = chants[currentChantIndex];

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const stopCurrentAudio = () => {
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch (error) {
        // Oscillator already stopped
      }
    });
    oscillatorsRef.current = [];
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const createDevotionalHarmony = (audioContext: AudioContext, gainNode: GainNode) => {
    // Create a harmonious blend of frequencies that sound like devotional music
    const frequencies = [
      261.63, // C4 - Root note
      329.63, // E4 - Major third
      392.00, // G4 - Perfect fifth
      523.25, // C5 - Octave
    ];

    const oscillators: OscillatorNode[] = [];

    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const oscillatorGain = audioContext.createGain();
      
      oscillator.connect(oscillatorGain);
      oscillatorGain.connect(gainNode);
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscillator.type = 'sine';
      
      // Set different volumes for harmony
      const baseVolume = volume / 100 * 0.15;
      const volumes = [baseVolume, baseVolume * 0.6, baseVolume * 0.4, baseVolume * 0.3];
      oscillatorGain.gain.setValueAtTime(volumes[index], audioContext.currentTime);
      
      // Add subtle vibrato for spiritual effect
      const lfoGain = audioContext.createGain();
      const lfo = audioContext.createOscillator();
      lfo.frequency.setValueAtTime(4.5, audioContext.currentTime);
      lfo.type = 'sine';
      lfoGain.gain.setValueAtTime(2, audioContext.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      
      oscillator.start();
      lfo.start();
      
      oscillators.push(oscillator);
    });

    return oscillators;
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      stopCurrentAudio();
      setIsPlaying(false);
    } else {
      try {
        setIsLoading(true);
        
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        
        audioContextRef.current = audioContext;
        gainNodeRef.current = gainNode;
        
        // Create devotional harmony instead of single tone
        const oscillators = createDevotionalHarmony(audioContext, gainNode);
        oscillatorsRef.current = oscillators;
        
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
          stopCurrentAudio();
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
    if (gainNodeRef.current && audioContextRef.current) {
      const baseVolume = newVolume / 100 * 0.15;
      gainNodeRef.current.gain.setValueAtTime(baseVolume, audioContextRef.current.currentTime);
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
