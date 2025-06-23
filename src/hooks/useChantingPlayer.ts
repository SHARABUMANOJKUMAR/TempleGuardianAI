
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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentChant = chants[currentChantIndex];

  // Real devotional audio URLs (these would be real audio files in production)
  const audioSources = {
    'om-namah-shivaya': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    'hare-krishna': 'https://www.soundjay.com/misc/sounds/bell-ringing-04.wav',
    'om-gam-ganapataye': 'https://www.soundjay.com/misc/sounds/bell-ringing-03.wav',
    'aditya-hridayam': 'https://www.soundjay.com/misc/sounds/bell-ringing-02.wav',
    'vishnu-sahasranamam': 'https://www.soundjay.com/misc/sounds/bell-ringing-01.wav'
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const initializeAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Create new audio element
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume / 100;
    
    // Use a placeholder bell sound for now (in production, use real devotional chants)
    audio.src = audioSources[currentChant.id as keyof typeof audioSources] || 
                'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUfBjiJ1fPIeCgEKHzJ8N2OOAkRVbHr6aRRFAxBlN7zuGQdBz2O1/LHeDEKKYDI8+CPOAUTVr7l6KdUEwxBl9zvunnUBp5RU+/xmBNjh6R0hMeRNcRIJ7SrKKjXXbN0HGhzm7qxnqhxD9X+kJa9s+ajl8e1gBjSYF+Uf2ymnPzxpoWNj4yVnl1lZ3GJl6qr6eZrGz5tn6Gsn2kSCdvhk56xnmp3dZm6ta';
    
    audioRef.current = audio;

    // Set duration from chant data
    const [minutes, seconds] = currentChant.duration.split(':').map(Number);
    setDuration(minutes * 60 + seconds);

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration || (minutes * 60 + seconds));
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      handleNext();
    });

    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      setIsLoading(false);
    });

    return audio;
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) {
      initializeAudio();
    }

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      try {
        setIsLoading(true);
        await audioRef.current?.play();
        setIsPlaying(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Playback failed:', error);
        setIsLoading(false);
      }
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleNext = () => {
    setCurrentChantIndex((prev) => 
      prev === chants.length - 1 ? 0 : prev + 1
    );
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setCurrentChantIndex((prev) => 
      prev === 0 ? chants.length - 1 : prev - 1
    );
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Initialize audio when chant changes
  useEffect(() => {
    initializeAudio();
    setCurrentTime(0);
    setIsPlaying(false);
  }, [currentChant]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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
