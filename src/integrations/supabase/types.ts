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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      mission_activity_log: {
        Row: {
          action: string
          actor: string
          agent: string | null
          created_at: string
          id: string
          mission_id: string | null
          owner_id: string
          payload: Json
          status: string | null
        }
        Insert: {
          action: string
          actor: string
          agent?: string | null
          created_at?: string
          id?: string
          mission_id?: string | null
          owner_id: string
          payload?: Json
          status?: string | null
        }
        Update: {
          action?: string
          actor?: string
          agent?: string | null
          created_at?: string
          id?: string
          mission_id?: string | null
          owner_id?: string
          payload?: Json
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mission_activity_log_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_approvals: {
        Row: {
          approved_at: string
          approved_channels: Json
          approver_name: string
          budget_cap: number
          created_at: string
          id: string
          mission_id: string
          owner_id: string
          require_future_approval: boolean
        }
        Insert: {
          approved_at?: string
          approved_channels?: Json
          approver_name: string
          budget_cap: number
          created_at?: string
          id?: string
          mission_id: string
          owner_id: string
          require_future_approval?: boolean
        }
        Update: {
          approved_at?: string
          approved_channels?: Json
          approver_name?: string
          budget_cap?: number
          created_at?: string
          id?: string
          mission_id?: string
          owner_id?: string
          require_future_approval?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "mission_approvals_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_decisions: {
        Row: {
          arr_high: number | null
          arr_low: number | null
          assumptions: Json
          audit_status: string
          confidence: number | null
          created_at: string
          decision_text: string | null
          evidence: Json
          forecast_period_days: number | null
          id: string
          mission_id: string
          owner_id: string
          owner_role: string | null
          primary_kpi: string | null
          risks: Json
          secondary_kpis: Json
          test_budget: number | null
          updated_at: string
        }
        Insert: {
          arr_high?: number | null
          arr_low?: number | null
          assumptions?: Json
          audit_status?: string
          confidence?: number | null
          created_at?: string
          decision_text?: string | null
          evidence?: Json
          forecast_period_days?: number | null
          id?: string
          mission_id: string
          owner_id: string
          owner_role?: string | null
          primary_kpi?: string | null
          risks?: Json
          secondary_kpis?: Json
          test_budget?: number | null
          updated_at?: string
        }
        Update: {
          arr_high?: number | null
          arr_low?: number | null
          assumptions?: Json
          audit_status?: string
          confidence?: number | null
          created_at?: string
          decision_text?: string | null
          evidence?: Json
          forecast_period_days?: number | null
          id?: string
          mission_id?: string
          owner_id?: string
          owner_role?: string | null
          primary_kpi?: string | null
          risks?: Json
          secondary_kpis?: Json
          test_budget?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_decisions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          brand_description: string | null
          brand_name: string | null
          brand_tone: string | null
          budget_ceiling: number | null
          created_at: string
          current_step: number
          form: Json
          id: string
          name: string
          objective: string | null
          owner_id: string
          primary_kpi: string | null
          status: string
          target_arr: number | null
          timeline_days: number | null
          updated_at: string
        }
        Insert: {
          brand_description?: string | null
          brand_name?: string | null
          brand_tone?: string | null
          budget_ceiling?: number | null
          created_at?: string
          current_step?: number
          form?: Json
          id?: string
          name?: string
          objective?: string | null
          owner_id: string
          primary_kpi?: string | null
          status?: string
          target_arr?: number | null
          timeline_days?: number | null
          updated_at?: string
        }
        Update: {
          brand_description?: string | null
          brand_name?: string | null
          brand_tone?: string | null
          budget_ceiling?: number | null
          created_at?: string
          current_step?: number
          form?: Json
          id?: string
          name?: string
          objective?: string | null
          owner_id?: string
          primary_kpi?: string | null
          status?: string
          target_arr?: number | null
          timeline_days?: number | null
          updated_at?: string
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
