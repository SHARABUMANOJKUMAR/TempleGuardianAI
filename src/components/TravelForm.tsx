
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import type { Agent, TravelPlan } from "@/pages/Index";

interface TravelFormProps {
  agent: Agent;
  onSubmit: (plan: TravelPlan) => void;
  onBack: () => void;
}

const agentTitles = {
  temple: "🛕 Temple Guide",
  senior: "👵 Senior Travel Advisor", 
  planner: "🗺️ Trip Planner",
  booking: "📱 Booking Assistant",
  share: "📤 Share & Export"
};

export const TravelForm = ({ agent, onSubmit, onBack }: TravelFormProps) => {
  const [formData, setFormData] = useState({
    location: "",
    dates: "",
    isSenior: false,
    preferences: "",
    groupSize: "",
    budget: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const plan: TravelPlan = {
      location: formData.location,
      dates: formData.dates,
      isSenior: formData.isSenior,
      preferences: formData.preferences
    };

    onSubmit(plan);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            <ArrowLeft size={16} />
          </Button>
          <div>
            <CardTitle className="text-orange-900">{agentTitles[agent]}</CardTitle>
            <CardDescription className="text-orange-600">
              Please provide your travel details for personalized recommendations
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-orange-900">
                Destination / Region
              </Label>
              <Input
                id="location"
                placeholder="e.g., Varanasi, Tamil Nadu, Char Dham"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="border-orange-200 focus:border-orange-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dates" className="text-orange-900">
                Travel Dates
              </Label>
              <Input
                id="dates"
                type="date"
                value={formData.dates}
                onChange={(e) => setFormData(prev => ({ ...prev, dates: e.target.value }))}
                className="border-orange-200 focus:border-orange-400"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Switch
              id="senior"
              checked={formData.isSenior}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSenior: checked }))}
            />
            <Label htmlFor="senior" className="text-blue-900">
              👵 Traveling with senior citizens (60+ years)
            </Label>
          </div>

          {formData.isSenior && (
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-800 mb-2">
                ✨ We'll include wheelchair accessibility, medical facilities, and comfortable rest stops in your recommendations.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="groupSize" className="text-orange-900">
                Group Size
              </Label>
              <Input
                id="groupSize"
                placeholder="e.g., 2 people, Family of 4"
                value={formData.groupSize}
                onChange={(e) => setFormData(prev => ({ ...prev, groupSize: e.target.value }))}
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-orange-900">
                Budget Range (Optional)
              </Label>
              <Input
                id="budget"
                placeholder="e.g., ₹10,000 - ₹20,000"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferences" className="text-orange-900">
              Special Preferences / Requirements
            </Label>
            <Textarea
              id="preferences"
              placeholder="e.g., specific temples to visit, dietary requirements, mobility assistance needed, meditation sessions..."
              value={formData.preferences}
              onChange={(e) => setFormData(prev => ({ ...prev, preferences: e.target.value }))}
              className="min-h-20 border-orange-200 focus:border-orange-400"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            size="lg"
          >
            Generate Spiritual Journey Plan ✨
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
