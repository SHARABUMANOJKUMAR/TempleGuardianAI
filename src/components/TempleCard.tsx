
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Accessibility, Plus } from "lucide-react";

interface Temple {
  name: string;
  location: string;
  timing: string;
  image: string;
  accessibility?: string;
  specialNote?: string;
  nearbyMedical?: string;
}

interface TempleCardProps {
  temple: Temple;
  showAccessibility?: boolean;
}

export const TempleCard = ({ temple, showAccessibility }: TempleCardProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-orange-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="text-3xl">{temple.image}</div>
          <div className="flex-1">
            <CardTitle className="text-orange-900 text-lg">{temple.name}</CardTitle>
            <CardDescription className="text-orange-600 flex items-center gap-1">
              <MapPin size={14} />
              {temple.location}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-orange-700">
          <Clock size={14} />
          <span className="font-medium">Darshan Timing:</span>
          {temple.timing}
        </div>

        {showAccessibility && temple.accessibility && (
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Accessibility size={14} />
              <span className="font-medium">Accessibility:</span>
              {temple.accessibility}
            </div>
            {temple.specialNote && (
              <div className="text-xs text-blue-700 mt-1">{temple.specialNote}</div>
            )}
            {temple.nearbyMedical && (
              <div className="text-xs text-blue-700 mt-1">
                🏥 {temple.nearbyMedical}
              </div>
            )}
          </div>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
        >
          <Plus size={14} className="mr-2" />
          Add to Itinerary
        </Button>
      </CardContent>
    </Card>
  );
};
