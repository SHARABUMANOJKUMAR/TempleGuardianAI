
import { useState } from "react";
import { Header } from "@/components/Header";
import { AgentSelector } from "@/components/AgentSelector";
import { TravelForm } from "@/components/TravelForm";
import { ItineraryDisplay } from "@/components/ItineraryDisplay";
import { TempleCard } from "@/components/TempleCard";

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
  const [currentStep, setCurrentStep] = useState<"select" | "form" | "results">("select");

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Header onReset={resetToStart} />
      
      <main className="container mx-auto px-4 py-8">
        {currentStep === "select" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-orange-900 mb-4">
                🛕 Temple & Senior Travel AI
              </h1>
              <p className="text-lg text-orange-700 max-w-2xl mx-auto">
                Your spiritual journey companion for temple visits and senior-friendly travel across India
              </p>
            </div>
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
      </main>
    </div>
  );
};

export default Index;
