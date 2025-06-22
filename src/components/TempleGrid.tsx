
import { useState } from 'react';
import { useTemples } from '@/hooks/useTemples';
import { TempleCard } from './TempleCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';

export const TempleGrid = () => {
  const { data: temples, isLoading, error } = useTemples();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
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
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
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
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900 flex items-center gap-2">
            <Search size={20} />
            Discover Sacred Temples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-orange-400" size={16} />
              <Input
                placeholder="Search temples, locations, or deities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-orange-200 focus:border-orange-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-orange-600" />
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-48 border-orange-200">
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

      <div className="text-center mb-6">
        <p className="text-orange-700">
          Found {filteredTemples.length} sacred temples
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemples.map((temple) => (
          <TempleCard key={temple.id} temple={temple} showAccessibility={true} />
        ))}
      </div>

      {filteredTemples.length === 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-12 text-center">
            <p className="text-orange-700 text-lg">
              No temples found matching your criteria.
            </p>
            <p className="text-orange-600 mt-2">
              Try adjusting your search or filter options.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
