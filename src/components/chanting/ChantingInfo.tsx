
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChantingInfoProps {
  title: string;
  deity: string;
  templeName: string;
  isLoading: boolean;
  currentIndex: number;
  totalChants: number;
}

export const ChantingInfo = ({ 
  title, 
  deity, 
  templeName, 
  isLoading, 
  currentIndex, 
  totalChants 
}: ChantingInfoProps) => {
  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="text-amber-900 flex items-center gap-2 text-base">
          🎵 Sacred Chanting - {templeName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-amber-900 text-sm">{title}</h3>
          <p className="text-amber-700 text-xs">For {deity}</p>
          {isLoading && (
            <p className="text-amber-600 text-xs">Loading sacred chants...</p>
          )}
        </div>

        {totalChants > 1 && (
          <div className="text-center">
            <p className="text-xs text-amber-600">
              {currentIndex + 1} of {totalChants} chants
            </p>
          </div>
        )}

        <div className="bg-amber-100 p-2 rounded-lg border border-amber-200">
          <p className="text-amber-800 text-xs">
            🙏 Listen to these sacred chants to enhance your spiritual connection with {deity}. 
            Each mantra carries divine vibrations that purify the mind and soul.
          </p>
        </div>
      </CardContent>
    </>
  );
};
