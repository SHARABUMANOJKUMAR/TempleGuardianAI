
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, MessageCircle, Calendar, Copy, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { TravelPlan } from "@/pages/Index";

interface ShareOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  plan: TravelPlan;
}

export const ShareOptions = ({ isOpen, onClose, plan }: ShareOptionsProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const generateWhatsAppMessage = () => {
    const message = `🛕 My Spiritual Journey to ${plan.location}

📅 Date: ${plan.dates}
${plan.isSenior ? '👵 Senior-friendly itinerary included' : ''}

🏛️ Temples to Visit:
• Kashi Vishwanath Temple (4:00 AM - 11:00 PM)
• Sankat Mochan Hanuman Temple (5:00 AM - 10:00 PM)

📋 Day 1 Schedule:
• 6:00 AM - Sunrise Ganga Aarti
• 10:00 AM - Kashi Vishwanath Darshan
• 5:00 PM - Sankat Mochan Temple

Generated by Temple Guardian AI 🚩`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppShare = () => {
    const message = generateWhatsAppMessage();
    let url = `https://wa.me/`;
    
    if (phoneNumber.trim()) {
      // Remove any non-digit characters and add country code if needed
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      const number = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
      url += `${number}?text=${message}`;
    } else {
      url += `?text=${message}`;
    }
    
    window.open(url, '_blank');
    toast({
      title: "WhatsApp Opened",
      description: "Your travel plan has been formatted for WhatsApp sharing!",
    });
  };

  const handleCopyLink = () => {
    const message = generateWhatsAppMessage();
    navigator.clipboard.writeText(decodeURIComponent(message));
    toast({
      title: "Copied to Clipboard",
      description: "Your travel plan has been copied to clipboard!",
    });
  };

  const handleCalendarExport = () => {
    const startDate = new Date(plan.dates);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);
    
    const calendarEvent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Temple Guardian AI//EN
BEGIN:VEVENT
UID:${Date.now()}@templeai.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:Spiritual Journey to ${plan.location}
DESCRIPTION:Temple visit itinerary generated by Temple Guardian AI
LOCATION:${plan.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([calendarEvent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'temple-visit.ics';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Calendar Event Created",
      description: "Your travel plan has been downloaded as a calendar file!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-orange-900">Share Your Spiritual Journey</DialogTitle>
          <DialogDescription>
            Choose how you'd like to share your temple visit plan
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-orange-900">
              WhatsApp Number (Optional)
            </Label>
            <Input
              id="phone"
              placeholder="+91 9876543210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border-orange-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleWhatsAppShare}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle size={16} className="mr-2" />
              WhatsApp
            </Button>
            
            <Button 
              onClick={handleCalendarExport}
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <Calendar size={16} className="mr-2" />
              Calendar
            </Button>
            
            <Button 
              onClick={handleCopyLink}
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <Copy size={16} className="mr-2" />
              Copy Text
            </Button>
            
            <Button 
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <Download size={16} className="mr-2" />
              PDF
            </Button>
          </div>

          <div className="pt-4 border-t border-orange-200">
            <p className="text-sm text-orange-600 text-center">
              🛕 Share your spiritual journey with family and friends
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
