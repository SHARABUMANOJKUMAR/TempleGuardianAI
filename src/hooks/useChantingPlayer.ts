
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
  const gainNodesRef = useRef<GainNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);

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
        console.log('Oscillator already stopped');
      }
    });
    oscillatorsRef.current = [];
    gainNodesRef.current = [];
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const createDevotionalChant = (audioContext: AudioContext, masterGain: GainNode) => {
    // Create beautiful, spiritual sounding frequencies based on Indian classical ragas
    const devotionalFrequencies = {
      'om-namah-shivaya': [
        { freq: 138.59, type: 'sine' as OscillatorType }, // Om base frequency
        { freq: 207.89, type: 'triangle' as OscillatorType }, // Sacred harmonic
        { freq: 277.18, type: 'sine' as OscillatorType }, // Spiritual overtone
        { freq: 415.77, type: 'sawtooth' as OscillatorType }, // Divine resonance
      ],
      'hare-krishna': [
        { freq: 164.81, type: 'sine' as OscillatorType }, // Krishna's flute tone
        { freq: 246.94, type: 'triangle' as OscillatorType }, // Devotional harmony
        { freq: 329.63, type: 'sine' as OscillatorType }, // Love frequency
        { freq: 493.88, type: 'sawtooth' as OscillatorType }, // Blissful overtone
      ],
      'om-gam-ganapataye': [
        { freq: 146.83, type: 'sine' as OscillatorType }, // Ganesha's sacred tone
        { freq: 220.00, type: 'triangle' as OscillatorType }, // Obstacle removal frequency
        { freq: 293.66, type: 'sine' as OscillatorType }, // Wisdom vibration
        { freq: 440.00, type: 'sawtooth' as OscillatorType }, // Success harmony
      ],
      default: [
        { freq: 136.10, type: 'sine' as OscillatorType }, // Universal Om
        { freq: 204.15, type: 'triangle' as OscillatorType }, // Sacred geometry
        { freq: 272.20, type: 'sine' as OscillatorType }, // Divine proportion
        { freq: 408.30, type: 'sawtooth' as OscillatorType }, // Spiritual elevation
      ]
    };

    const chantFreqs = devotionalFrequencies[currentChant.id as keyof typeof devotionalFrequencies] || devotionalFrequencies.default;
    const oscillators: OscillatorNode[] = [];
    const gainNodes: GainNode[] = [];

    chantFreqs.forEach((freqData, index) => {
      // Create oscillator for the main tone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(masterGain);
      
      oscillator.frequency.setValueAtTime(freqData.freq, audioContext.currentTime);
      oscillator.type = freqData.type;
      
      // Set volumes to create rich, layered sound
      const baseVolume = (volume / 100) * 0.08; // Much softer base volume
      const volumes = [baseVolume * 1.2, baseVolume * 0.8, baseVolume * 0.6, baseVolume * 0.4];
      gainNode.gain.setValueAtTime(volumes[index] || baseVolume * 0.3, audioContext.currentTime);
      
      // Add gentle vibrato for spiritual effect
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      lfo.frequency.setValueAtTime(3.5 + Math.random() * 2, audioContext.currentTime); // Slower, more meditative vibrato
      lfo.type = 'sine';
      lfoGain.gain.setValueAtTime(1.5, audioContext.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      
      // Add subtle amplitude modulation for breathing effect
      const ampLfo = audioContext.createOscillator();
      const ampGain = audioContext.createGain();
      ampLfo.frequency.setValueAtTime(0.5 + Math.random() * 0.3, audioContext.currentTime); // Very slow breathing
      ampLfo.type = 'sine';
      ampGain.gain.setValueAtTime(0.2, audioContext.currentTime);
      
      ampLfo.connect(ampGain);
      ampGain.connect(gainNode.gain);
      
      oscillator.start();
      lfo.start();
      ampLfo.start();
      
      oscillators.push(oscillator);
      gainNodes.push(gainNode);
    });

    return { oscillators, gainNodes };
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      stopCurrentAudio();
      setIsPlaying(false);
    } else {
      try {
        setIsLoading(true);
        
        // Create audio context with better settings
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 44100,
          latencyHint: 'interactive'
        });
        
        const masterGain = audioContext.createGain();
        
        // Add a subtle reverb effect for spiritual ambiance
        const convolver = audioContext.createConvolver();
        const reverbGain = audioContext.createGain();
        
        // Create impulse response for reverb (simple hall reverb)
        const reverbTime = 2.0;
        const sampleRate = audioContext.sampleRate;
        const length = sampleRate * reverbTime;
        const impulse = audioContext.createBuffer(2, length, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
          const channelData = impulse.getChannelData(channel);
          for (let i = 0; i < length; i++) {
            channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
          }
        }
        
        convolver.buffer = impulse;
        reverbGain.gain.setValueAtTime(0.3, audioContext.currentTime);
        
        // Connect the audio chain
        masterGain.connect(reverbGain);
        reverbGain.connect(convolver);
        convolver.connect(audioContext.destination);
        masterGain.connect(audioContext.destination); // Also connect dry signal
        
        audioContextRef.current = audioContext;
        masterGainRef.current = masterGain;
        
        // Create devotional chant
        const { oscillators, gainNodes } = createDevotionalChant(audioContext, masterGain);
        oscillatorsRef.current = oscillators;
        gainNodesRef.current = gainNodes;
        
        setIsPlaying(true);
        setIsLoading(false);
        
        // Start timing
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
    if (masterGainRef.current && audioContextRef.current) {
      const newGain = (newVolume / 100) * 0.15;
      masterGainRef.current.gain.setValueAtTime(newGain, audioContextRef.current.currentTime);
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
      if (audioContextRef.current) {
        audioContextRef.current.close();
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
