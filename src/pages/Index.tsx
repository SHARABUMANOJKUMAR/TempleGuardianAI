
import { useState } from "react";
import { Header } from "@/components/Header";
import { AgentSelector } from "@/components/AgentSelector";
import { TravelForm } from "@/components/TravelForm";
import { ItineraryDisplay } from "@/components/ItineraryDisplay";
import { TempleGrid } from "@/components/TempleGrid";
import { GoogleMap } from "@/components/GoogleMap";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { AIChat } from "@/components/AIChat";
import { useTemples } from "@/hooks/useTemples";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MapIcon, Grid3X3, MessageCircle, Mic } from "lucide-react";

export type Agent = "temple" | "senior" | "planner" | "booking" | "share";

export interface TravelPlan {
  location: string;
  dates: string;
  isSenior: boolean;
  preferences: string;
  temples?: any[];
  itinerary?: any[];
}

const Index = () => {
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [currentStep, setCurrentStep] = useState<"select" | "form" | "results" | "explore">("select");
  const [selectedTemple, setSelectedTemple] = useState<any>(null);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  
  const { data: temples = [] } = useTemples();

  const handleAgentSelect = (agent: Agent) => {
    setActiveAgent(agent);
    setCurrentStep("form");
  };

  const handlePlanSubmit = (plan: TravelPlan) => {
    setTravelPlan(plan);
    setCurrentStep("results");
  };

  const resetToStart = () => {
    setActiveAgent(null);
    setTravelPlan(null);
    setCurrentStep("select");
    setSelectedTemple(null);
  };

  const goToExplore = () => {
    setCurrentStep("explore");
  };

  const handleVoiceResponse = (response: string) => {
    console.log('Voice Assistant Response:', response);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Header onReset={resetToStart} />
      
      <main className="container mx-auto px-4 py-8">
        {currentStep === "select" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-orange-900 mb-4">
                🛕 Temple Guardian AI
              </h1>
              <p className="text-lg text-orange-700 max-w-2xl mx-auto mb-6">
                Your intelligent companion for temple visits and spiritual journeys across India with AI-powered assistance
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={goToExplore}
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <Grid3X3 size={16} className="mr-2" />
                  Explore Temples
                </Button>
                <Button
                  onClick={() => setShowVoiceAssistant(!showVoiceAssistant)}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Mic size={16} className="mr-2" />
                  Voice Assistant
                </Button>
              </div>
            </div>

            {showVoiceAssistant && (
              <div className="mb-8 max-w-md mx-auto">
                <VoiceAssistant onResponse={handleVoiceResponse} />
              </div>
            )}

            <AgentSelector onAgentSelect={handleAgentSelect} />
          </div>
        )}

        {currentStep === "form" && activeAgent && (
          <div className="max-w-2xl mx-auto">
            <TravelForm 
              agent={activeAgent} 
              onSubmit={handlePlanSubmit}
              onBack={() => setCurrentStep("select")}
            />
          </div>
        )}

        {currentStep === "results" && travelPlan && (
          <div className="max-w-6xl mx-auto">
            <ItineraryDisplay 
              plan={travelPlan} 
              agent={activeAgent!}
              onBack={() => setCurrentStep("form")}
            />
          </div>
        )}

        {currentStep === "explore" && (
          <div className="max-w-7xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200 mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-orange-900">
                    🛕 Sacred Temple Explorer
                  </CardTitle>
                  <Button
                    onClick={() => setCurrentStep("select")}
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    Back to Home
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-orange-700 mb-4">
                  Discover India's most sacred temples with our comprehensive database of 50+ temples, 
                  complete with history, accessibility information, and spiritual guidance.
                </p>
                
                <Tabs defaultValue="grid" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="grid" className="flex items-center gap-2">
                      <Grid3X3 size={16} />
                      Temple Grid
                    </TabsTrigger>
                    <TabsTrigger value="map" className="flex items-center gap-2">
                      <MapIcon size={16} />
                      Map View
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="flex items-center gap-2">
                      <MessageCircle size={16} />
                      AI Assistant
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="grid" className="mt-6">
                    <TempleGrid />
                  </TabsContent>
                  
                  <TabsContent value="map" className="mt-6">
                    <GoogleMap 
                      temples={temples}
                      selectedTemple={selectedTemple}
                      onTempleSelect={setSelectedTemple}
                    />
                  </TabsContent>
                  
                  <TabsContent value="chat" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <AIChat agent="temple" />
                      <div className="space-y-4">
                        <AIChat agent="senior" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
