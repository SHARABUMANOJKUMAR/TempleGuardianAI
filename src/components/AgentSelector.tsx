
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar, CreditCard, Share2 } from "lucide-react";
import type { Agent } from "@/pages/Index";

interface AgentSelectorProps {
  onAgentSelect: (agent: Agent) => void;
}

const agents = [
  {
    id: "temple" as Agent,
    title: "🛕 Temple Guide",
    description: "Find temples, timings, history, and darshan information",
    icon: MapPin,
    color: "from-orange-500 to-red-500",
    features: ["Temple information", "Darshan timings", "History & significance", "Dress codes"]
  },
  {
    id: "senior" as Agent,
    title: "👵 Senior Travel Advisor",
    description: "Senior-friendly destinations with medical safety tips",
    icon: Users,
    color: "from-blue-500 to-purple-500",
    features: ["Wheelchair accessibility", "Medical facilities nearby", "Rest stops", "Senior discounts"]
  },
  {
    id: "planner" as Agent,
    title: "🗺️ Trip Planner",
    description: "Create detailed day-wise spiritual journey itineraries",
    icon: Calendar,
    color: "from-green-500 to-teal-500",
    features: ["Multi-day itineraries", "Optimized routes", "Time management", "Local recommendations"]
  },
  {
    id: "booking" as Agent,
    title: "📱 Booking Assistant",
    description: "Generate WhatsApp booking links and donation options",
    icon: CreditCard,
    color: "from-yellow-500 to-orange-500",
    features: ["WhatsApp booking", "UPI donations", "Accommodation links", "Transport booking"]
  },
  {
    id: "share" as Agent,
    title: "📤 Share & Export",
    description: "Create PDFs, calendar invites, and shareable trip plans",
    icon: Share2,
    color: "from-purple-500 to-pink-500",
    features: ["PDF itineraries", "Calendar events", "WhatsApp sharing", "Printable guides"]
  }
];

export const AgentSelector = ({ onAgentSelect }: AgentSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => {
        const IconComponent = agent.icon;
        return (
          <Card 
            key={agent.id} 
            className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-orange-200 bg-white/80 backdrop-blur-sm"
            onClick={() => onAgentSelect(agent.id)}
          >
            <CardHeader className="pb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${agent.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <IconComponent className="text-white" size={24} />
              </div>
              <CardTitle className="text-orange-900 group-hover:text-orange-700 transition-colors">
                {agent.title}
              </CardTitle>
              <CardDescription className="text-orange-600">
                {agent.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 mb-4">
                {agent.features.map((feature, index) => (
                  <li key={index} className="text-sm text-orange-700 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full bg-gradient-to-r ${agent.color} hover:opacity-90 text-white border-0`}
              >
                Select Agent
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
