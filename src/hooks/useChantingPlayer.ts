
import { useState } from 'react';
import { ChantData, UseChantingPlayerProps } from '@/types/chanting';
import { useAudioPlayer } from './useAudioPlayer';
import { formatTime, getAudioSourceForChant } from '@/utils/audioUtils';

export const useChantingPlayer = ({ chants, initialVolume = 70 }: UseChantingPlayerProps) => {
  const [currentChantIndex, setCurrentChantIndex] = useState(0);
  const [volume, setVolume] = useState(initialVolume);

  const currentChant = chants[currentChantIndex];
  const audioSrc = getAudioSourceForChant(currentChant.id);

  const handleNext = () => {
    setCurrentChantIndex((prev) => 
      prev === chants.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevious = () => {
    setCurrentChantIndex((prev) => 
      prev === 0 ? chants.length - 1 : prev - 1
    );
  };

  const audioPlayer = useAudioPlayer({
    audioSrc,
    duration: currentChant.duration,
    volume,
    onEnded: handleNext
  });

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    audioPlayer.handleVolumeChange(newVolume);
  };

  return {
    isPlaying: audioPlayer.isPlaying,
    currentTime: audioPlayer.currentTime,
    duration: audioPlayer.duration,
    volume,
    currentChantIndex,
    isLoading: audioPlayer.isLoading,
    currentChant,
    formatTime,
    togglePlayPause: audioPlayer.togglePlayPause,
    handleSeek: audioPlayer.handleSeek,
    handleVolumeChange,
    handleNext,
    handlePrevious
  };
};
