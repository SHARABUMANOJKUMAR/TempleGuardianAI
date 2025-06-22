export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_conversations: {
        Row: {
          agent_type: string
          created_at: string
          id: string
          messages: Json | null
          session_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agent_type: string
          created_at?: string
          id?: string
          messages?: Json | null
          session_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          agent_type?: string
          created_at?: string
          id?: string
          messages?: Json | null
          session_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      itineraries: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          estimated_cost: number | null
          id: string
          is_senior_friendly: boolean | null
          start_date: string
          status: string | null
          temples: string[] | null
          title: string
          total_days: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          estimated_cost?: number | null
          id?: string
          is_senior_friendly?: boolean | null
          start_date: string
          status?: string | null
          temples?: string[] | null
          title: string
          total_days?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          estimated_cost?: number | null
          id?: string
          is_senior_friendly?: boolean | null
          start_date?: string
          status?: string | null
          temples?: string[] | null
          title?: string
          total_days?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      temple_reviews: {
        Row: {
          accessibility_rating: number | null
          created_at: string
          id: string
          rating: number | null
          review_text: string | null
          temple_id: string
          updated_at: string
          user_id: string
          visit_date: string | null
        }
        Insert: {
          accessibility_rating?: number | null
          created_at?: string
          id?: string
          rating?: number | null
          review_text?: string | null
          temple_id: string
          updated_at?: string
          user_id: string
          visit_date?: string | null
        }
        Update: {
          accessibility_rating?: number | null
          created_at?: string
          id?: string
          rating?: number | null
          review_text?: string | null
          temple_id?: string
          updated_at?: string
          user_id?: string
          visit_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "temple_reviews_temple_id_fkey"
            columns: ["temple_id"]
            isOneToOne: false
            referencedRelation: "temples"
            referencedColumns: ["id"]
          },
        ]
      }
      temples: {
        Row: {
          accessibility_features: string[] | null
          architecture_style: string | null
          built_year: number | null
          chanting_audio_url: string | null
          contact_number: string | null
          created_at: string
          deity: string | null
          district: string | null
          dress_code: string | null
          entry_fee: number | null
          festivals: string[] | null
          history: string | null
          id: string
          image_url: string | null
          is_wheelchair_accessible: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          nearby_medical: string | null
          parking_available: boolean | null
          rating: number | null
          reviews_count: number | null
          significance: string | null
          special_rituals: string[] | null
          state: string
          timing: string
          updated_at: string
          website: string | null
        }
        Insert: {
          accessibility_features?: string[] | null
          architecture_style?: string | null
          built_year?: number | null
          chanting_audio_url?: string | null
          contact_number?: string | null
          created_at?: string
          deity?: string | null
          district?: string | null
          dress_code?: string | null
          entry_fee?: number | null
          festivals?: string[] | null
          history?: string | null
          id?: string
          image_url?: string | null
          is_wheelchair_accessible?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          nearby_medical?: string | null
          parking_available?: boolean | null
          rating?: number | null
          reviews_count?: number | null
          significance?: string | null
          special_rituals?: string[] | null
          state: string
          timing: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          accessibility_features?: string[] | null
          architecture_style?: string | null
          built_year?: number | null
          chanting_audio_url?: string | null
          contact_number?: string | null
          created_at?: string
          deity?: string | null
          district?: string | null
          dress_code?: string | null
          entry_fee?: number | null
          festivals?: string[] | null
          history?: string | null
          id?: string
          image_url?: string | null
          is_wheelchair_accessible?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          nearby_medical?: string | null
          parking_available?: boolean | null
          rating?: number | null
          reviews_count?: number | null
          significance?: string | null
          special_rituals?: string[] | null
          state?: string
          timing?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          accessibility_needs: string[] | null
          age: number | null
          created_at: string
          full_name: string | null
          id: string
          is_senior: boolean | null
          preferred_language: string | null
          travel_preferences: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accessibility_needs?: string[] | null
          age?: number | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_senior?: boolean | null
          preferred_language?: string | null
          travel_preferences?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accessibility_needs?: string[] | null
          age?: number | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_senior?: boolean | null
          preferred_language?: string | null
          travel_preferences?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
