
import { useState } from 'react';
import { useTemples } from '@/hooks/useTemples';
import { useIsMobile } from '@/hooks/use-mobile';
import { TempleCard } from './TempleCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';

export const TempleGrid = () => {
  const { data: temples, isLoading, error } = useTemples();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-3 p-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4'}`}>
        {Array.from({ length: isMobile ? 4 : 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-orange-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-orange-100 rounded"></div>
                <div className="h-4 bg-orange-100 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className={`border-red-200 bg-red-50 ${isMobile ? 'mx-2' : 'mx-4'}`}>
        <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <p className="text-red-700">Error loading temples. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  const states = [...new Set(temples?.map(temple => temple.state) || [])].sort();

  const filteredTemples = temples?.filter(temple => {
    const matchesSearch = temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         temple.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         temple.deity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'all' || temple.state === selectedState;
    return matchesSearch && matchesState;
  }) || [];

  return (
    <div className={`space-y-4 ${isMobile ? 'p-2' : 'p-4'}`}>
      <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
        <CardHeader className={`${isMobile ? 'pb-3' : 'pb-4'}`}>
          <CardTitle className={`text-orange-900 flex items-center gap-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
            <Search size={isMobile ? 16 : 20} />
            Discover Sacred Temples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-col sm:flex-row gap-3'}`}>
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-3 text-orange-400`} size={16} />
              <Input
                placeholder="Search temples, locations, or deities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 border-orange-200 focus:border-orange-400 ${isMobile ? 'text-sm' : ''}`}
              />
            </div>
            <div className={`flex items-center gap-2 ${isMobile ? 'w-full' : 'sm:w-auto w-full'}`}>
              <Filter size={16} className="text-orange-600 flex-shrink-0" />
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className={`${isMobile ? 'w-full' : 'sm:w-48 w-full'} border-orange-200`}>
                  <SelectValue placeholder="Filter by state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className={`text-orange-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          Found {filteredTemples.length} sacred temples
        </p>
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'}`}>
        {filteredTemples.map((temple) => (
          <TempleCard key={temple.id} temple={temple} showAccessibility={true} />
        ))}
      </div>

      {filteredTemples.length === 0 && (
        <Card className={`border-orange-200 bg-orange-50 ${isMobile ? 'mx-2' : 'mx-4'}`}>
          <CardContent className={`${isMobile ? 'p-8' : 'p-12'} text-center`}>
            <p className={`text-orange-700 ${isMobile ? 'text-base' : 'text-lg'}`}>
              No temples found matching your criteria.
            </p>
            <p className={`text-orange-600 mt-2 ${isMobile ? 'text-sm' : ''}`}>
              Try adjusting your search or filter options.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
