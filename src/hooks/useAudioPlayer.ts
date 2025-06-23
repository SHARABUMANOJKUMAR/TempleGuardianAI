
import { useState, useRef, useEffect } from 'react';
import { AudioPlayerState } from '@/types/chanting';
import { parseDuration } from '@/utils/audioUtils';

interface UseAudioPlayerProps {
  audioSrc: string;
  duration: string;
  volume: number;
  onEnded: () => void;
}

export const useAudioPlayer = ({ audioSrc, duration, volume, onEnded }: UseAudioPlayerProps) => {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: parseDuration(duration),
    volume,
    isLoading: false
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initializeAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume / 100;
    audio.src = audioSrc;
    
    audioRef.current = audio;

    const expectedDuration = parseDuration(duration);
    setState(prev => ({ ...prev, duration: expectedDuration }));

    audio.addEventListener('loadedmetadata', () => {
      setState(prev => ({ ...prev, duration: audio.duration || expectedDuration }));
    });

    audio.addEventListener('timeupdate', () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    });

    audio.addEventListener('ended', () => {
      setState(prev => ({ ...prev, isPlaying: false }));
      onEnded();
    });

    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      setState(prev => ({ ...prev, isLoading: false }));
    });

    return audio;
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) {
      initializeAudio();
    }

    if (state.isPlaying) {
      audioRef.current?.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    } else {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        await audioRef.current?.play();
        setState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
      } catch (error) {
        console.error('Playback failed:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setState(prev => ({ ...prev, currentTime: newTime }));
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setState(prev => ({ ...prev, volume: newVolume }));
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  // Initialize audio when source changes
  useEffect(() => {
    initializeAudio();
    setState(prev => ({ ...prev, currentTime: 0, isPlaying: false }));
  }, [audioSrc]);

  // Update volume when prop changes
  useEffect(() => {
    setState(prev => ({ ...prev, volume }));
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    ...state,
    togglePlayPause,
    handleSeek,
    handleVolumeChange
  };
};
