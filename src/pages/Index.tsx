
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
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();

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
      {/* Sacred Om Pattern Background */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='${isMobile ? '80' : '120'}' height='${isMobile ? '80' : '120'}' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='om' x='0' y='0' width='50' height='50' patternUnits='userSpaceOnUse'%3E%3Ctext x='25' y='35' text-anchor='middle' font-size='${isMobile ? '16' : '20'}' fill='%23f59e0b' opacity='0.1'%3E🕉️%3C/text%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23om)'/%3E%3C/svg%3E")`,
          backgroundSize: isMobile ? '80px 80px' : '120px 120px'
        }}
      />
      
      <Header onReset={resetToStart} />
      
      <main className={`container mx-auto ${isMobile ? 'px-2 py-4' : 'px-4 py-8'} relative z-10`}>
        {currentStep === "select" && (
          <div className="max-w-4xl mx-auto">
            <div className={`text-center ${isMobile ? 'mb-6 px-2' : 'mb-12 px-2'}`}>
              <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl md:text-5xl'} font-bold text-orange-900 mb-3 sm:mb-4 leading-tight`}>
                🛕 Temple Guardian AI
              </h1>
              <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-orange-700 max-w-2xl mx-auto mb-4 sm:mb-6 px-2`}>
                Your intelligent companion for temple visits and spiritual journeys across India with AI-powered assistance
              </p>
              <div className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-col gap-2 sm:flex-row sm:gap-3'} justify-center items-center max-w-md mx-auto`}>
                <Button
                  onClick={goToExplore}
                  variant="outline"
                  className={`border-orange-300 text-orange-700 hover:bg-orange-50 ${isMobile ? 'w-full' : 'w-full sm:w-auto'} text-sm`}
                >
                  <Grid3X3 size={14} className="mr-2" />
                  Explore Temples
                </Button>
                <Button
                  onClick={() => setShowVoiceAssistant(!showVoiceAssistant)}
                  variant="outline"
                  className={`border-purple-300 text-purple-700 hover:bg-purple-50 ${isMobile ? 'w-full' : 'w-full sm:w-auto'} text-sm`}
                >
                  <Mic size={14} className="mr-2" />
                  Voice Assistant
                </Button>
              </div>
            </div>

            {showVoiceAssistant && (
              <div className={`${isMobile ? 'mb-4 px-2' : 'mb-6 max-w-md mx-auto px-2'}`}>
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
            <Card className={`bg-white/90 backdrop-blur-sm border-orange-200 ${isMobile ? 'mb-4 mx-1' : 'mb-6 mx-2'} shadow-lg`}>
              <CardHeader className={`${isMobile ? 'pb-3' : 'pb-4'}`}>
                <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between'}`}>
                  <CardTitle className={`text-orange-900 ${isMobile ? 'text-lg' : 'text-lg sm:text-xl'} text-center sm:text-left`}>
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
              <CardContent className={`${isMobile ? 'px-3' : 'px-6'}`}>
                <p className={`text-orange-700 mb-4 ${isMobile ? 'text-xs' : 'text-base'} text-center sm:text-left`}>
                  Discover India's most sacred temples with our comprehensive database, 
                  complete with history, accessibility information, and spiritual guidance.
                </p>
                
                <Tabs defaultValue="grid" className="w-full">
                  <TabsList className={`grid w-full grid-cols-3 ${isMobile ? 'mb-4' : 'mb-6'} h-auto`}>
                    <TabsTrigger value="grid" className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} items-center gap-1 ${isMobile ? 'text-xs py-2 px-1' : 'text-sm py-2 px-1'}`}>
                      <Grid3X3 size={14} />
                      <span className={isMobile ? '' : 'sm:hidden'}>Grid</span>
                      <span className={isMobile ? 'hidden' : 'hidden sm:inline'}>Temple Grid</span>
                    </TabsTrigger>
                    <TabsTrigger value="map" className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} items-center gap-1 ${isMobile ? 'text-xs py-2 px-1' : 'text-sm py-2 px-1'}`}>
                      <MapIcon size={14} />
                      <span className={isMobile ? '' : 'sm:hidden'}>Map</span>
                      <span className={isMobile ? 'hidden' : 'hidden sm:inline'}>Map View</span>
                    </TabsTrigger>
                    <TabsTrigger value="chat" className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} items-center gap-1 ${isMobile ? 'text-xs py-2 px-1' : 'text-sm py-2 px-1'}`}>
                      <MessageCircle size={14} />
                      <span className={isMobile ? '' : 'sm:hidden'}>AI</span>
                      <span className={isMobile ? 'hidden' : 'hidden sm:inline'}>AI Assistant</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="grid" className={`${isMobile ? 'mt-4' : 'mt-6'}`}>
                    <TempleGrid />
                  </TabsContent>
                  
                  <TabsContent value="map" className={`${isMobile ? 'mt-4' : 'mt-6'}`}>
                    <div className={`${isMobile ? 'h-[50vh]' : 'h-[60vh] sm:h-[70vh]'} rounded-lg overflow-hidden`}>
                      <GoogleMap 
                        temples={temples}
                        selectedTemple={selectedTemple}
                        onTempleSelect={setSelectedTemple}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="chat" className={`${isMobile ? 'mt-4' : 'mt-6'}`}>
                    <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 gap-6'}`}>
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
