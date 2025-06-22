
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Temple {
  id: string;
  name: string;
  location: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  timing: string;
  history: string;
  significance: string;
  deity: string;
  architecture_style: string;
  built_year: number;
  image_url: string;
  chanting_audio_url?: string;
  accessibility_features: string[];
  nearby_medical: string;
  entry_fee: number;
  dress_code: string;
  special_rituals: string[];
  festivals: string[];
  contact_number?: string;
  website?: string;
  rating: number;
  reviews_count: number;
  is_wheelchair_accessible: boolean;
  parking_available: boolean;
  created_at: string;
  updated_at: string;
}

export const useTemples = () => {
  return useQuery({
    queryKey: ['temples'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('temples')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Temple[];
    },
  });
};

export const useTemplesByState = (state: string) => {
  return useQuery({
    queryKey: ['temples', state],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('temples')
        .select('*')
        .eq('state', state)
        .order('name');
      
      if (error) throw error;
      return data as Temple[];
    },
    enabled: !!state,
  });
};
