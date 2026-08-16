export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      areas: {
        Row: {
          created_at: string
          id: string
          name: string
          property_id: string
          shared_allocation_pct: number | null
          target_ready_date: string | null
          target_rent_cents: number | null
          type: Database["public"]["Enums"]["area_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          property_id: string
          shared_allocation_pct?: number | null
          target_ready_date?: string | null
          target_rent_cents?: number | null
          type: Database["public"]["Enums"]["area_type"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          property_id?: string
          shared_allocation_pct?: number | null
          target_ready_date?: string | null
          target_rent_cents?: number | null
          type?: Database["public"]["Enums"]["area_type"]
        }
        Relationships: [
          {
            foreignKeyName: "areas_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          caption: string | null
          file_url: string
          id: string
          related_id: string
          related_type: Database["public"]["Enums"]["attachment_related_type"]
          uploaded_at: string
          uploaded_by_id: string
        }
        Insert: {
          caption?: string | null
          file_url: string
          id?: string
          related_id: string
          related_type: Database["public"]["Enums"]["attachment_related_type"]
          uploaded_at?: string
          uploaded_by_id: string
        }
        Update: {
          caption?: string | null
          file_url?: string
          id?: string
          related_id?: string
          related_type?: Database["public"]["Enums"]["attachment_related_type"]
          uploaded_at?: string
          uploaded_by_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_uploaded_by_id_fkey"
            columns: ["uploaded_by_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      attention_dismissals: {
        Row: {
          dismissed_at: string
          dismissed_by_id: string
          id: string
          item_id: string
        }
        Insert: {
          dismissed_at?: string
          dismissed_by_id: string
          id?: string
          item_id: string
        }
        Update: {
          dismissed_at?: string
          dismissed_by_id?: string
          id?: string
          item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attention_dismissals_dismissed_by_id_fkey"
            columns: ["dismissed_by_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          created_at: string
          id: string
          limit_cents: number
          notes: string | null
          related_id: string
          related_type: Database["public"]["Enums"]["budget_related_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          limit_cents: number
          notes?: string | null
          related_id: string
          related_type: Database["public"]["Enums"]["budget_related_type"]
        }
        Update: {
          created_at?: string
          id?: string
          limit_cents?: number
          notes?: string | null
          related_id?: string
          related_type?: Database["public"]["Enums"]["budget_related_type"]
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_id: string
          created_at: string
          id: string
          project_id: string
          text: string
        }
        Insert: {
          author_id: string
          created_at?: string
          id?: string
          project_id: string
          text: string
        }
        Update: {
          author_id?: string
          created_at?: string
          id?: string
          project_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      contractors: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          rating: number | null
          trade: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          rating?: number | null
          trade?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          rating?: number | null
          trade?: string | null
        }
        Relationships: []
      }
      cost_items: {
        Row: {
          actual_cost_cents: number | null
          category: Database["public"]["Enums"]["cost_category"]
          created_at: string
          estimated_cost_cents: number
          id: string
          label: string
          paid_date: string | null
          project_id: string
        }
        Insert: {
          actual_cost_cents?: number | null
          category?: Database["public"]["Enums"]["cost_category"]
          created_at?: string
          estimated_cost_cents: number
          id?: string
          label: string
          paid_date?: string | null
          project_id: string
        }
        Update: {
          actual_cost_cents?: number | null
          category?: Database["public"]["Enums"]["cost_category"]
          created_at?: string
          estimated_cost_cents?: number
          id?: string
          label?: string
          paid_date?: string | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cost_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          area_id: string
          category: string | null
          created_at: string
          description: string | null
          id: string
          lead_id: string
          priority: Database["public"]["Enums"]["project_priority"]
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          target_end_date: string | null
          title: string
        }
        Insert: {
          area_id: string
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          lead_id: string
          priority?: Database["public"]["Enums"]["project_priority"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          target_end_date?: string | null
          title: string
        }
        Update: {
          area_id?: string
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          lead_id?: string
          priority?: Database["public"]["Enums"]["project_priority"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          target_end_date?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          created_at: string
          id: string
          notes: string | null
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          notes?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          notes?: string | null
        }
        Relationships: []
      }
      quote_reminders: {
        Row: {
          created_at: string
          dismissed_at: string | null
          id: string
          offset_days: number
          quote_id: string
          sent_at: string | null
        }
        Insert: {
          created_at?: string
          dismissed_at?: string | null
          id?: string
          offset_days: number
          quote_id: string
          sent_at?: string | null
        }
        Update: {
          created_at?: string
          dismissed_at?: string | null
          id?: string
          offset_days?: number
          quote_id?: string
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_reminders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          amount_cents: number
          contractor_id: string
          created_at: string
          id: string
          project_id: string
          received_date: string | null
          scope_description: string | null
          status: Database["public"]["Enums"]["quote_status"]
          valid_until: string | null
        }
        Insert: {
          amount_cents: number
          contractor_id: string
          created_at?: string
          id?: string
          project_id: string
          received_date?: string | null
          scope_description?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          valid_until?: string | null
        }
        Update: {
          amount_cents?: number
          contractor_id?: string
          created_at?: string
          id?: string
          project_id?: string
          received_date?: string | null
          scope_description?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to_id: string | null
          created_at: string
          due_date: string | null
          id: string
          is_done: boolean
          order: number
          project_id: string
          title: string
        }
        Insert: {
          assigned_to_id?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          is_done?: boolean
          order?: number
          project_id: string
          title: string
        }
        Update: {
          assigned_to_id?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          is_done?: boolean
          order?: number
          project_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_id_fkey"
            columns: ["assigned_to_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
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
      area_type: "rental_unit" | "external" | "shared"
      attachment_related_type: "project" | "quote" | "cost_item"
      budget_related_type: "property" | "area" | "project"
      cost_category: "materials" | "labor" | "permits" | "other"
      project_priority: "low" | "medium" | "high"
      project_status: "idea" | "planned" | "in_progress" | "done" | "blocked"
      quote_status: "requested" | "received" | "accepted" | "declined"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      area_type: ["rental_unit", "external", "shared"],
      attachment_related_type: ["project", "quote", "cost_item"],
      budget_related_type: ["property", "area", "project"],
      cost_category: ["materials", "labor", "permits", "other"],
      project_priority: ["low", "medium", "high"],
      project_status: ["idea", "planned", "in_progress", "done", "blocked"],
      quote_status: ["requested", "received", "accepted", "declined"],
    },
  },
} as const

