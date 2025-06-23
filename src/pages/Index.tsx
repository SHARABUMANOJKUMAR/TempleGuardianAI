
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
      {/* Beautiful animated background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="om" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse"%3E%3Ctext x="25" y="30" text-anchor="middle" font-size="20" fill="%23f59e0b" opacity="0.1"%3E🕉️%3C/text%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23om)"/%3E%3C/svg%3E')] opacity-20"></div>
      
      <Header onReset={resetToStart} />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10">
        {currentStep === "select" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-12 px-2">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-orange-900 mb-3 sm:mb-4 leading-tight">
                🛕 Temple Guardian AI
              </h1>
              <p className="text-sm sm:text-lg text-orange-700 max-w-2xl mx-auto mb-4 sm:mb-6 px-2">
                Your intelligent companion for temple visits and spiritual journeys across India with AI-powered assistance
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 justify-center items-center max-w-md mx-auto">
                <Button
                  onClick={goToExplore}
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50 w-full sm:w-auto text-sm"
                >
                  <Grid3X3 size={14} className="mr-2" />
                  Explore Temples
                </Button>
                <Button
                  onClick={() => setShowVoiceAssistant(!showVoiceAssistant)}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 w-full sm:w-auto text-sm"
                >
                  <Mic size={14} className="mr-2" />
                  Voice Assistant
                </Button>
              </div>
            </div>

            {showVoiceAssistant && (
              <div className="mb-6 max-w-md mx-auto px-2">
                <VoiceAssistant onResponse={handleVoiceResponse} />
              </div>
            )}

            <div className="px-2">
              <AgentSelector onAgentSelect={handleAgentSelect} />
            </div>
          </div>
        )}

        {currentStep === "form" && activeAgent && (
          <div className="max-w-2xl mx-auto px-2">
            <TravelForm 
              agent={activeAgent} 
              onSubmit={handlePlanSubmit}
              onBack={() => setCurrentStep("select")}
            />
          </div>
        )}

        {currentStep === "results" && travelPlan && (
          <div className="max-w-6xl mx-auto px-2">
            <ItineraryDisplay 
              plan={travelPlan} 
              agent={activeAgent!}
              onBack={() => setCurrentStep("form")}
            />
          </div>
        )}

        {currentStep === "explore" && (
          <div className="max-w-7xl mx-auto">
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200 mb-4 sm:mb-6 mx-2 shadow-lg">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-orange-900 text-lg sm:text-xl text-center sm:text-left">
                    🛕 Sacred Temple Explorer
                  </CardTitle>
                  <Button
                    onClick={() => setCurrentStep("select")}
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50 text-sm"
                  >
                    Back to Home
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <p className="text-orange-700 mb-4 text-xs sm:text-base text-center sm:text-left">
                  Discover India's most sacred temples with our comprehensive database, 
                  complete with history, accessibility information, and spiritual guidance.
                </p>
                
                <Tabs defaultValue="grid" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 h-auto">
                    <TabsTrigger value="grid" className="flex flex-col sm:flex-row items-center gap-1 text-xs sm:text-sm py-2 px-1">
                      <Grid3X3 size={14} />
                      <span className="sm:hidden">Grid</span>
                      <span className="hidden sm:inline">Temple Grid</span>
                    </TabsTrigger>
                    <TabsTrigger value="map" className="flex flex-col sm:flex-row items-center gap-1 text-xs sm:text-sm py-2 px-1">
                      <MapIcon size={14} />
                      <span className="sm:hidden">Map</span>
                      <span className="hidden sm:inline">Map View</span>
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="flex flex-col sm:flex-row items-center gap-1 text-xs sm:text-sm py-2 px-1">
                      <MessageCircle size={14} />
                      <span className="sm:hidden">AI</span>
                      <span className="hidden sm:inline">AI Assistant</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="grid" className="mt-4 sm:mt-6">
                    <TempleGrid />
                  </TabsContent>
                  
                  <TabsContent value="map" className="mt-4 sm:mt-6">
                    <div className="h-[60vh] sm:h-[70vh] rounded-lg overflow-hidden">
                      <GoogleMap 
                        temples={temples}
                        selectedTemple={selectedTemple}
                        onTempleSelect={setSelectedTemple}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="chat" className="mt-4 sm:mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
