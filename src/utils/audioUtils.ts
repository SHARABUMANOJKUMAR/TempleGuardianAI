
export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const parseDuration = (duration: string): number => {
  const [minutes, seconds] = duration.split(':').map(Number);
  return minutes * 60 + seconds;
};

export const generateDevotionalAudio = (frequency: number, duration: number): string => {
  const sampleRate = 44100;
  const samples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples * 2, true);
  
  // Generate spiritual tones with harmonics
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 0.5) * Math.sin(t * Math.PI * 2);
    
    // Primary tone (Om frequency)
    let sample = Math.sin(2 * Math.PI * frequency * t) * 0.3;
    
    // Add harmonics for richness
    sample += Math.sin(2 * Math.PI * frequency * 2 * t) * 0.15; // Octave
    sample += Math.sin(2 * Math.PI * frequency * 3 * t) * 0.1; // Fifth
    sample += Math.sin(2 * Math.PI * frequency * 1.5 * t) * 0.05; // Perfect fifth
    
    // Add gentle reverb effect
    if (i > sampleRate * 0.1) {
      sample += view.getInt16(44 + (i - Math.floor(sampleRate * 0.1)) * 2, true) / 32768 * 0.2;
    }
    
    // Apply envelope
    sample *= envelope;
    
    // Convert to 16-bit PCM
    const pcm = Math.max(-1, Math.min(1, sample)) * 0x7FFF;
    view.setInt16(44 + i * 2, pcm, true);
  }
  
  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
};

export const getAudioSourceForChant = (chantId: string): string => {
  const frequencies = {
    'om-namah-shivaya': 136.1, // Om frequency
    'hare-krishna': 144, // D note for Krishna
    'om-gam-ganapataye': 128, // C note for Ganesha
    'aditya-hridayam': 126.22, // Sun frequency
    'vishnu-sahasranamam': 341.3 // Heart chakra frequency
  };
  
  const frequency = frequencies[chantId as keyof typeof frequencies] || 136.1;
  return generateDevotionalAudio(frequency, 30); // 30 seconds
};
