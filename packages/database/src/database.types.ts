export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          additional_info: string | null
          application_no: string
          category: string
          city: string
          college: string
          consented_at: string
          course: string | null
          created_at: string
          description: string
          email: string
          full_name: string
          graduation_year: string | null
          id: string
          idea_title: string
          linkedin_url: string | null
          mobile: string
          participant_role: string
          pitch_deck_url: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          stage: string
          state: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          additional_info?: string | null
          application_no?: string
          category: string
          city: string
          college: string
          consented_at: string
          course?: string | null
          created_at?: string
          description: string
          email: string
          full_name: string
          graduation_year?: string | null
          id?: string
          idea_title: string
          linkedin_url?: string | null
          mobile: string
          participant_role: string
          pitch_deck_url?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          stage: string
          state: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          additional_info?: string | null
          application_no?: string
          category?: string
          city?: string
          college?: string
          consented_at?: string
          course?: string | null
          created_at?: string
          description?: string
          email?: string
          full_name?: string
          graduation_year?: string | null
          id?: string
          idea_title?: string
          linkedin_url?: string | null
          mobile?: string
          participant_role?: string
          pitch_deck_url?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          stage?: string
          state?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: number
        }
        Insert: {
          action: string
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: never
        }
        Update: {
          action?: string
          actor_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: never
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          application_id: string | null
          created_at: string
          email: string
          event_id: string
          full_name: string
          id: string
          mobile: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["registration_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string
          email: string
          event_id: string
          full_name: string
          id?: string
          mobile?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string
          email?: string
          event_id?: string
          full_name?: string
          id?: string
          mobile?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_tickets: {
        Row: {
          checked_in_at: string | null
          checked_in_by: string | null
          created_at: string
          event_id: string
          id: string
          registration_id: string
          status: Database["public"]["Enums"]["ticket_status"]
          ticket_code: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          checked_in_at?: string | null
          checked_in_by?: string | null
          created_at?: string
          event_id: string
          id?: string
          registration_id: string
          status?: Database["public"]["Enums"]["ticket_status"]
          ticket_code?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          checked_in_at?: string | null
          checked_in_by?: string | null
          created_at?: string
          event_id?: string
          id?: string
          registration_id?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          ticket_code?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_tickets_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: true
            referencedRelation: "event_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string
          city: string | null
          created_at: string
          created_by: string | null
          date_end: string | null
          date_start: string
          description: string
          highlights: string[]
          id: string
          is_published: boolean
          location: string | null
          max_capacity: number | null
          registration_open: boolean
          slug: string
          state: string | null
          status: Database["public"]["Enums"]["event_status"]
          summary: string
          title: string
          updated_at: string
          venue: string
        }
        Insert: {
          category: string
          city?: string | null
          created_at?: string
          created_by?: string | null
          date_end?: string | null
          date_start: string
          description?: string
          highlights?: string[]
          id?: string
          is_published?: boolean
          location?: string | null
          max_capacity?: number | null
          registration_open?: boolean
          slug: string
          state?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          summary?: string
          title: string
          updated_at?: string
          venue: string
        }
        Update: {
          category?: string
          city?: string | null
          created_at?: string
          created_by?: string | null
          date_end?: string | null
          date_start?: string
          description?: string
          highlights?: string[]
          id?: string
          is_published?: boolean
          location?: string | null
          max_capacity?: number | null
          registration_open?: boolean
          slug?: string
          state?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          summary?: string
          title?: string
          updated_at?: string
          venue?: string
        }
        Relationships: []
      }
      notification_outbox: {
        Row: {
          attempts: number
          available_at: string
          channel: string
          created_at: string
          id: number
          last_error: string | null
          payload: Json
          processed_at: string | null
          recipient: string
          status: string
          template: string
        }
        Insert: {
          attempts?: number
          available_at?: string
          channel?: string
          created_at?: string
          id?: never
          last_error?: string | null
          payload?: Json
          processed_at?: string | null
          recipient: string
          status?: string
          template: string
        }
        Update: {
          attempts?: number
          available_at?: string
          channel?: string
          created_at?: string
          id?: never
          last_error?: string | null
          payload?: Json
          processed_at?: string | null
          recipient?: string
          status?: string
          template?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          mobile: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          mobile?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          mobile?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: { required_role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      is_staff: { Args: never; Returns: boolean }
      review_application: {
        Args: {
          application_id: string
          decision: Database["public"]["Enums"]["application_status"]
          notes?: string
        }
        Returns: {
          additional_info: string | null
          application_no: string
          category: string
          city: string
          college: string
          consented_at: string
          course: string | null
          created_at: string
          description: string
          email: string
          full_name: string
          graduation_year: string | null
          id: string
          idea_title: string
          linkedin_url: string | null
          mobile: string
          participant_role: string
          pitch_deck_url: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          stage: string
          state: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
          website_url: string | null
        }
        SetofOptions: {
          from: "*"
          to: "applications"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      submit_application: { Args: { payload: Json }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "reviewer" | "event_manager" | "support"
      application_status: "pending" | "in_review" | "approved" | "rejected"
      event_status: "draft" | "upcoming" | "completed" | "cancelled"
      registration_status: "pending" | "confirmed" | "waitlisted" | "cancelled"
      ticket_status: "confirmed" | "checked_in" | "cancelled"
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
    Enums: {
      app_role: ["admin", "reviewer", "event_manager", "support"],
      application_status: ["pending", "in_review", "approved", "rejected"],
      event_status: ["draft", "upcoming", "completed", "cancelled"],
      registration_status: ["pending", "confirmed", "waitlisted", "cancelled"],
      ticket_status: ["confirmed", "checked_in", "cancelled"],
    },
  },
} as const
