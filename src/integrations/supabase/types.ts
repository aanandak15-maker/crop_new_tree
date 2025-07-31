export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      crop_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          crop_id: string
          id: string
          image_url: string
          is_primary: boolean | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          crop_id: string
          id?: string
          image_url: string
          is_primary?: boolean | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          crop_id?: string
          id?: string
          image_url?: string
          is_primary?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_images_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
        ]
      }
      crops: {
        Row: {
          climate_type: string[] | null
          created_at: string
          description: string | null
          growth_duration: string | null
          id: string
          name: string
          scientific_name: string | null
          season: string[] | null
          soil_type: string[] | null
          updated_at: string
          water_requirement: string | null
        }
        Insert: {
          climate_type?: string[] | null
          created_at?: string
          description?: string | null
          growth_duration?: string | null
          id?: string
          name: string
          scientific_name?: string | null
          season?: string[] | null
          soil_type?: string[] | null
          updated_at?: string
          water_requirement?: string | null
        }
        Update: {
          climate_type?: string[] | null
          created_at?: string
          description?: string | null
          growth_duration?: string | null
          id?: string
          name?: string
          scientific_name?: string | null
          season?: string[] | null
          soil_type?: string[] | null
          updated_at?: string
          water_requirement?: string | null
        }
        Relationships: []
      }
      disease_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          disease_id: string
          id: string
          image_url: string
          is_primary: boolean | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          disease_id: string
          id?: string
          image_url: string
          is_primary?: boolean | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          disease_id?: string
          id?: string
          image_url?: string
          is_primary?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "disease_images_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "diseases"
            referencedColumns: ["id"]
          },
        ]
      }
      diseases: {
        Row: {
          affected_crops: string[] | null
          created_at: string
          description: string | null
          id: string
          name: string
          prevention_methods: string[] | null
          scientific_name: string | null
          symptoms: string[] | null
          treatment_methods: string[] | null
          updated_at: string
        }
        Insert: {
          affected_crops?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          prevention_methods?: string[] | null
          scientific_name?: string | null
          symptoms?: string[] | null
          treatment_methods?: string[] | null
          updated_at?: string
        }
        Update: {
          affected_crops?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          prevention_methods?: string[] | null
          scientific_name?: string | null
          symptoms?: string[] | null
          treatment_methods?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      pest_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          id: string
          image_url: string
          is_primary: boolean | null
          pest_id: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean | null
          pest_id: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean | null
          pest_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pest_images_pest_id_fkey"
            columns: ["pest_id"]
            isOneToOne: false
            referencedRelation: "pests"
            referencedColumns: ["id"]
          },
        ]
      }
      pests: {
        Row: {
          affected_crops: string[] | null
          created_at: string
          description: string | null
          id: string
          name: string
          prevention_methods: string[] | null
          scientific_name: string | null
          symptoms: string[] | null
          treatment_methods: string[] | null
          updated_at: string
        }
        Insert: {
          affected_crops?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          prevention_methods?: string[] | null
          scientific_name?: string | null
          symptoms?: string[] | null
          treatment_methods?: string[] | null
          updated_at?: string
        }
        Update: {
          affected_crops?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          prevention_methods?: string[] | null
          scientific_name?: string | null
          symptoms?: string[] | null
          treatment_methods?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      varieties: {
        Row: {
          created_at: string
          crop_id: string
          disease_resistance: string[] | null
          duration: string | null
          grain_quality: string | null
          id: string
          market_type: string | null
          name: string
          special_features: string[] | null
          suitable_states: string[] | null
          updated_at: string
          yield_potential: string | null
        }
        Insert: {
          created_at?: string
          crop_id: string
          disease_resistance?: string[] | null
          duration?: string | null
          grain_quality?: string | null
          id?: string
          market_type?: string | null
          name: string
          special_features?: string[] | null
          suitable_states?: string[] | null
          updated_at?: string
          yield_potential?: string | null
        }
        Update: {
          created_at?: string
          crop_id?: string
          disease_resistance?: string[] | null
          duration?: string | null
          grain_quality?: string | null
          id?: string
          market_type?: string | null
          name?: string
          special_features?: string[] | null
          suitable_states?: string[] | null
          updated_at?: string
          yield_potential?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "varieties_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
        ]
      }
      variety_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          id: string
          image_url: string
          is_primary: boolean | null
          variety_id: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean | null
          variety_id: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean | null
          variety_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variety_images_variety_id_fkey"
            columns: ["variety_id"]
            isOneToOne: false
            referencedRelation: "varieties"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
