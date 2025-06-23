
export interface ChantData {
  id: string;
  title: string;
  deity: string;
  duration: string;
  url: string;
}

export interface UseChantingPlayerProps {
  chants: ChantData[];
  initialVolume?: number;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
}
