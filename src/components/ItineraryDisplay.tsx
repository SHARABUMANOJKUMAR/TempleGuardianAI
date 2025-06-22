
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Share2, MapPin, Clock, Accessibility } from "lucide-react";
import { TempleCard } from "./TempleCard";
import { ShareOptions } from "./ShareOptions";
import type { Agent, TravelPlan } from "@/pages/Index";

interface ItineraryDisplayProps {
  plan: TravelPlan;
  agent: Agent;
  onBack: () => void;
}

// Mock data for demonstration
const mockTemples = [
  {
    name: "Kashi Vishwanath Temple",
    location: "Varanasi, Uttar Pradesh",
    timing: "4:00 AM - 11:00 PM",
    image: "🛕",
    accessibility: "Wheelchair accessible main entrance",
    specialNote: "Senior-friendly: Dedicated seating area available",
    nearbyMedical: "BHU Hospital - 2.5 km"
  },
  {
    name: "Sankat Mochan Hanuman Temple",
    location: "Varanasi, Uttar Pradesh", 
    timing: "5:00 AM - 10:00 PM",
    image: "🐒",
    accessibility: "Ramp available, limited stairs",
    specialNote: "Peaceful environment, good for seniors",
    nearbyMedical: "Heritage Hospital - 1.8 km"
  }
];

const mockItinerary = [
  {
    day: "Day 1",
    date: "2024-06-22",
    activities: [
      { time: "6:00 AM", activity: "Sunrise Ganga Aarti", location: "Dashashwamedh Ghat", accessibility: "✅ Wheelchair accessible viewing area" },
      { time: "8:00 AM", activity: "Breakfast", location: "Hotel", accessibility: "✅ Senior-friendly menu available" },
      { time: "10:00 AM", activity: "Kashi Vishwanath Darshan", location: "Kashi Vishwanath Temple", accessibility: "✅ Priority darshan for seniors" },
      { time: "2:00 PM", activity: "Rest & Lunch", location: "Hotel", accessibility: "✅ Comfortable seating" },
      { time: "5:00 PM", activity: "Sankat Mochan Temple", location: "Sankat Mochan", accessibility: "✅ Minimal walking required" }
    ]
  }
];

export const ItineraryDisplay = ({ plan, agent, onBack }: ItineraryDisplayProps) => {
  const [showShareOptions, setShowShareOptions] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="border-orange-300 text-orange-700 hover:bg-orange-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Form
        </Button>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-orange-900">
            Your Spiritual Journey to {plan.location}
          </h2>
          <p className="text-orange-600">
            {plan.isSenior ? "Senior-friendly itinerary" : "Customized itinerary"} • {plan.dates}
          </p>
        </div>

        <Button 
          onClick={() => setShowShareOptions(true)}
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
        >
          <Share2 size={16} className="mr-2" />
          Share Plan
        </Button>
      </div>

      {plan.isSenior && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Accessibility size={20} />
              Senior-Friendly Features Included
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
              <div>✅ Wheelchair accessible paths</div>
              <div>✅ Medical facilities nearby</div>
              <div>✅ Regular rest stops</div>
              <div>✅ Priority darshan arrangements</div>
              <div>✅ Senior citizen discounts</div>
              <div>✅ Comfortable seating areas</div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-orange-900 mb-4 flex items-center gap-2">
            <MapPin size={20} />
            Recommended Temples
          </h3>
          <div className="space-y-4">
            {mockTemples.map((temple, index) => (
              <TempleCard key={index} temple={temple} showAccessibility={plan.isSenior} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-orange-900 mb-4 flex items-center gap-2">
            <Clock size={20} />
            Day-wise Itinerary
          </h3>
          <div className="space-y-4">
            {mockItinerary.map((day, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-orange-900">{day.day}</CardTitle>
                  <CardDescription className="text-orange-600">{day.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="flex gap-3 p-3 bg-orange-50 rounded-lg">
                        <div className="text-sm font-medium text-orange-700 min-w-20">
                          {activity.time}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-orange-900">{activity.activity}</div>
                          <div className="text-sm text-orange-600">{activity.location}</div>
                          {plan.isSenior && (
                            <div className="text-xs text-blue-700 mt-1">{activity.accessibility}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <ShareOptions 
        isOpen={showShareOptions} 
        onClose={() => setShowShareOptions(false)}
        plan={plan}
      />
    </div>
  );
};
