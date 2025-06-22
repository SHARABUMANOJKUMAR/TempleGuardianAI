
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceAssistantProps {
  onResponse?: (response: string) => void;
}

export const VoiceAssistant = ({ onResponse }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript.trim()) {
          processVoiceInput(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Please try again or check your microphone permissions.",
          variant: "destructive",
        });
      };
    }

    // Initialize Speech Synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [transcript]);

  const startListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
      return;
    }

    setIsListening(true);
    setTranscript('');
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const processVoiceInput = async (input: string) => {
    try {
      // Process voice input with AI logic
      let aiResponse = '';

      // Simple if-else logic for temple-related queries
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('temple') && lowerInput.includes('near')) {
        aiResponse = "I can help you find temples near your location. Please enable location services and I'll show you the nearest sacred temples.";
      } else if (lowerInput.includes('timing') || lowerInput.includes('open')) {
        aiResponse = "Most temples are open from early morning around 5 AM to late evening around 9 PM. However, timings vary by temple. Would you like specific timings for a particular temple?";
      } else if (lowerInput.includes('dress code') || lowerInput.includes('what to wear')) {
        aiResponse = "For most temples, traditional Indian attire is preferred. Avoid leather items and dress modestly. Some temples have strict dress codes, especially for entry into the inner sanctum.";
      } else if (lowerInput.includes('accessibility') || lowerInput.includes('wheelchair')) {
        aiResponse = "Many modern temples have wheelchair accessibility. I can filter temples that are senior-friendly and have accessibility features like ramps and dedicated seating areas.";
      } else if (lowerInput.includes('history') || lowerInput.includes('about')) {
        aiResponse = "Each temple has a rich history spanning centuries or millennia. I can provide detailed historical information about any specific temple you're interested in.";
      } else if (lowerInput.includes('chanting') || lowerInput.includes('mantra')) {
        aiResponse = "I can play sacred chants and mantras for different temples. Each temple has its specific prayers and chanting traditions that enhance your spiritual experience.";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('namaste')) {
        aiResponse = "Namaste! Welcome to Temple Guardian AI. I'm here to help you with your spiritual journey. You can ask me about temple timings, locations, history, dress codes, or accessibility features.";
      } else {
        // Fallback to AI API for complex queries
        const { data, error } = await supabase.functions.invoke('ai-chat', {
          body: {
            message: input,
            agent: 'temple',
            context: 'voice_assistant'
          }
        });

        if (error) throw error;
        aiResponse = data.response || "I'm here to help with your temple visit planning. Could you please rephrase your question?";
      }

      setResponse(aiResponse);
      onResponse?.(aiResponse);
      speakResponse(aiResponse);
    } catch (error) {
      console.error('Error processing voice input:', error);
      const fallbackResponse = "I apologize, I'm having trouble processing your request right now. Please try again.";
      setResponse(fallbackResponse);
      speakResponse(fallbackResponse);
    }
  };

  const speakResponse = (text: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel(); // Stop any ongoing speech
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    // Try to use a more natural voice
    const voices = synthRef.current.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Karen')
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="text-purple-900 flex items-center gap-2">
          <Mic size={20} />
          Voice Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`flex-1 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-purple-500 hover:bg-purple-600'
            } text-white`}
          >
            {isListening ? <MicOff size={16} className="mr-2" /> : <Mic size={16} className="mr-2" />}
            {isListening ? 'Stop Listening' : 'Start Voice Chat'}
          </Button>
          
          <Button
            onClick={isSpeaking ? stopSpeaking : undefined}
            disabled={!isSpeaking}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </Button>
        </div>

        {isListening && (
          <div className="p-3 bg-purple-100 rounded-lg border border-purple-200">
            <p className="text-purple-900 text-sm font-medium">Listening...</p>
            <p className="text-purple-700 text-sm mt-1">
              {transcript || 'Say something about temples, timings, or accessibility...'}
            </p>
          </div>
        )}

        {response && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-900 text-sm font-medium">Assistant Response:</p>
            <p className="text-blue-800 text-sm mt-1">{response}</p>
            {isSpeaking && (
              <div className="flex items-center gap-2 mt-2">
                <Volume2 size={14} className="text-blue-600 animate-pulse" />
                <span className="text-blue-600 text-xs">Speaking...</span>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-purple-600 text-center">
          💡 Try asking: "Find temples near me", "What are the timings?", "Is it wheelchair accessible?"
        </div>
      </CardContent>
    </Card>
  );
};
