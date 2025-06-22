
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Accessibility, Plus, Star, Phone, Globe, Calendar } from "lucide-react";
import { ChantingPlayer } from './ChantingPlayer';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Temple } from '@/hooks/useTemples';

interface TempleCardProps {
  temple: Temple;
  showAccessibility?: boolean;
}

export const TempleCard = ({ temple, showAccessibility }: TempleCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showChanting, setShowChanting] = useState(false);

  const formatCurrency = (amount: number) => {
    return amount === 0 ? 'Free' : `₹${amount}`;
  };

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="text-4xl group-hover:scale-110 transition-transform">
              {temple.image_url}
            </div>
            <div className="flex-1">
              <CardTitle className="text-orange-900 text-lg leading-tight">
                {temple.name}
              </CardTitle>
              <CardDescription className="text-orange-600 flex items-center gap-1 mt-1">
                <MapPin size={14} />
                {temple.location}, {temple.state}
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {temple.deity}
                </Badge>
                {temple.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">{temple.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-orange-700">
            <Clock size={14} />
            <span className="font-medium">Timings:</span>
            {temple.timing}
          </div>

          <div className="flex items-center gap-2 text-sm text-orange-700">
            <Calendar size={14} />
            <span className="font-medium">Built:</span>
            {temple.built_year || 'Ancient'}
            <span className="mx-2">•</span>
            <span className="font-medium">Entry:</span>
            {formatCurrency(temple.entry_fee)}
          </div>

          {showAccessibility && temple.accessibility_features.length > 0 && (
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <Accessibility size={14} />
                <span className="font-medium">Accessibility:</span>
              </div>
              <div className="text-xs text-blue-700 mt-1">
                {temple.accessibility_features.join(', ')}
              </div>
              {temple.nearby_medical && (
                <div className="text-xs text-blue-700 mt-1">
                  🏥 {temple.nearby_medical}
                </div>
              )}
            </div>
          )}

          {temple.history && (
            <div className="text-xs text-gray-600 line-clamp-2">
              {temple.history.substring(0, 120)}...
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <Plus size={14} className="mr-1" />
                  Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-orange-900 flex items-center gap-2">
                    {temple.image_url} {temple.name}
                  </DialogTitle>
                  <DialogDescription>
                    {temple.significance}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-2">Temple Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Deity:</span> {temple.deity}
                      </div>
                      <div>
                        <span className="font-medium">Architecture:</span> {temple.architecture_style}
                      </div>
                      <div>
                        <span className="font-medium">Built:</span> {temple.built_year || 'Ancient period'}
                      </div>
                      <div>
                        <span className="font-medium">Entry Fee:</span> {formatCurrency(temple.entry_fee)}
                      </div>
                    </div>
                  </div>

                  {temple.history && (
                    <div>
                      <h4 className="font-semibold text-orange-900 mb-2">History</h4>
                      <p className="text-sm text-gray-700">{temple.history}</p>
                    </div>
                  )}

                  {temple.dress_code && (
                    <div>
                      <h4 className="font-semibold text-orange-900 mb-2">Dress Code</h4>
                      <p className="text-sm text-gray-700">{temple.dress_code}</p>
                    </div>
                  )}

                  {temple.special_rituals && temple.special_rituals.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-orange-900 mb-2">Special Rituals</h4>
                      <div className="flex flex-wrap gap-2">
                        {temple.special_rituals.map((ritual, index) => (
                          <Badge key={index} variant="outline">{ritual}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {temple.festivals && temple.festivals.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-orange-900 mb-2">Major Festivals</h4>
                      <div className="flex flex-wrap gap-2">
                        {temple.festivals.map((festival, index) => (
                          <Badge key={index} variant="secondary">{festival}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {temple.contact_number && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Phone size={14} />
                        {temple.contact_number}
                      </div>
                    )}
                    {temple.website && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Globe size={14} />
                        <a href={temple.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showChanting} onOpenChange={setShowChanting}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  🎵 Chant
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-amber-900">Sacred Chanting</DialogTitle>
                  <DialogDescription>
                    Listen to traditional chants for {temple.name}
                  </DialogDescription>
                </DialogHeader>
                <ChantingPlayer temple={temple} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
