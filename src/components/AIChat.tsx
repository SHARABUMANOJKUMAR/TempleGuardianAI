
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatProps {
  agent: 'temple' | 'senior' | 'planner';
}

export const AIChat = ({ agent }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: getWelcomeMessage(agent),
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  function getWelcomeMessage(agent: string): string {
    switch (agent) {
      case 'temple':
        return "🛕 Namaste! I'm your Temple Guide AI. I can help you with temple information, timings, dress codes, history, and spiritual guidance. What would you like to know?";
      case 'senior':
        return "👵 Hello! I'm your Senior Travel Assistant. I specialize in making temple visits comfortable and accessible for seniors. I can help with wheelchair accessibility, medical facilities, and senior-friendly accommodations.";
      case 'planner':
        return "🗺️ Welcome! I'm your Trip Planner AI. I can create customized itineraries, suggest the best routes, recommend accommodations, and help plan your perfect spiritual journey. Where would you like to start?";
      default:
        return "🙏 Welcome to Temple Guardian AI! How can I assist you with your spiritual journey today?";
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Process message with AI logic using if-else conditions
      let aiResponse = await processMessageWithAI(inputMessage.trim(), agent);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, I'm having trouble processing your request. Please try again or rephrase your question.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const processMessageWithAI = async (message: string, agentType: string): Promise<string> => {
    const lowerMessage = message.toLowerCase();

    // Temple-specific logic
    if (agentType === 'temple') {
      if (lowerMessage.includes('timing') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
        return "🕐 Temple timings vary by location:\n\n• Most temples: 5:00 AM - 9:00 PM\n• Major temples: 4:00 AM - 11:00 PM\n• Some temples close for lunch: 12:00 PM - 4:00 PM\n\nWould you like specific timings for a particular temple?";
      }
      
      if (lowerMessage.includes('dress code') || lowerMessage.includes('clothing') || lowerMessage.includes('wear')) {
        return "👕 Temple dress code guidelines:\n\n• Traditional Indian attire preferred\n• Avoid shorts, mini skirts, sleeveless tops\n• Remove leather items (shoes, belts, bags)\n• Cover head in some temples\n• Modest, clean clothing\n\nSome temples provide cloth for covering if needed.";
      }
      
      if (lowerMessage.includes('prasad') || lowerMessage.includes('offering') || lowerMessage.includes('donate')) {
        return "🙏 About temple offerings:\n\n• Prasadam: Blessed food offered to devotees\n• Common offerings: Coconut, flowers, fruits, sweets\n• Monetary donations accepted\n• No compulsion to offer anything\n• Respect temple customs\n\nOfferings are a way to express devotion, not mandatory.";
      }
      
      if (lowerMessage.includes('history') || lowerMessage.includes('built') || lowerMessage.includes('ancient')) {
        return "📜 Indian temples have rich histories:\n\n• Many are over 1000+ years old\n• Built by various dynasties (Chola, Pallava, Vijayanagara)\n• Showcase incredible architecture\n• Survived invasions and natural disasters\n• Continuously renovated and maintained\n\nWhich temple's history interests you?";
      }
    }

    // Senior-specific logic
    if (agentType === 'senior') {
      if (lowerMessage.includes('wheelchair') || lowerMessage.includes('accessibility') || lowerMessage.includes('ramp')) {
        return "♿ Accessibility features for seniors:\n\n• Wheelchair ramps available in modern temples\n• Priority darshan for seniors (60+)\n• Dedicated seating areas\n• Golf cart services in large complexes\n• Elevator access where available\n• Nearby medical facilities\n\nI can filter temples with full accessibility features.";
      }
      
      if (lowerMessage.includes('medical') || lowerMessage.includes('hospital') || lowerMessage.includes('doctor')) {
        return "🏥 Medical facilities near temples:\n\n• Most major temples have nearby hospitals\n• First aid centers on premises\n• Emergency contact numbers available\n• Pharmacy services nearby\n• Ambulance services accessible\n• Medical volunteers during festivals\n\nAlways carry your medications and medical history.";
      }
      
      if (lowerMessage.includes('comfort') || lowerMessage.includes('rest') || lowerMessage.includes('tired')) {
        return "😌 Comfort features for seniors:\n\n• Rest areas with seating\n• Shade and cooling facilities\n• Clean restroom facilities\n• Drinking water stations\n• Guided tour options\n• Shorter walking routes\n• Comfortable transportation\n\nTake breaks as needed and stay hydrated!";
      }
    }

    // Planner-specific logic
    if (agentType === 'planner') {
      if (lowerMessage.includes('itinerary') || lowerMessage.includes('plan') || lowerMessage.includes('schedule')) {
        return "📅 Creating your temple itinerary:\n\n• Best time: Early morning or evening\n• Duration: 2-4 hours per major temple\n• Group size considerations\n• Transport arrangements\n• Accommodation booking\n• Local guide services\n• Festival calendar check\n\nTell me your preferred dates and locations!";
      }
      
      if (lowerMessage.includes('cost') || lowerMessage.includes('budget') || lowerMessage.includes('price')) {
        return "💰 Temple visit budget planning:\n\n• Entry fees: ₹0-₹50 (most are free)\n• Transport: ₹500-₹2000/day\n• Accommodation: ₹1000-₹5000/night\n• Food: ₹300-₹800/day\n• Guide services: ₹500-₹1500/day\n• Offerings: Optional\n\nTotal: ₹2000-₹10000/day depending on comfort level.";
      }
      
      if (lowerMessage.includes('transport') || lowerMessage.includes('travel') || lowerMessage.includes('reach')) {
        return "🚗 Transportation options:\n\n• Private taxi/car rental\n• Bus services (AC/Non-AC)\n• Train connectivity\n• Flight + local transport\n• Temple-provided shuttles\n• Walking paths for nearby temples\n\nI can suggest the best route based on your starting point!";
      }
    }

    // Common responses for all agents
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste')) {
      return `🙏 Namaste! I'm here to help with your spiritual journey. As your ${agentType} assistant, I can provide detailed guidance. What would you like to know?`;
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "🙏 You're most welcome! May your temple visits bring you peace, blessings, and spiritual fulfillment. Feel free to ask if you need any more assistance!";
    }

    // Fallback to OpenAI API for complex queries
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: message,
          agent: agentType,
          context: 'temple_assistant'
        }
      });

      if (error) throw error;
      return data.response || "I'm here to help with your temple visit planning. Could you please be more specific about what you'd like to know?";
    } catch (error) {
      // Fallback response if API fails
      return `As your ${agentType} assistant, I can help with temple information, accessibility, planning, and more. Could you please rephrase your question or be more specific about what you'd like to know?`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-orange-200 h-96">
      <CardHeader className="pb-3">
        <CardTitle className="text-orange-900 flex items-center gap-2">
          <Bot size={20} />
          {agent === 'temple' && '🛕 Temple Guide AI'}
          {agent === 'senior' && '👵 Senior Assistant'}
          {agent === 'planner' && '🗺️ Trip Planner AI'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-80 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div
                    className={`p-3 rounded-lg whitespace-pre-line ${
                      message.sender === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-gray-700">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-orange-200">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about temples, timings, accessibility..."
              className="flex-1 border-orange-200 focus:border-orange-400"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
