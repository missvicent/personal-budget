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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      _backup_views: {
        Row: {
          definition: string | null
          schemaname: unknown
          viewname: unknown
          viewowner: unknown
        }
        Insert: {
          definition?: string | null
          schemaname?: unknown
          viewname?: unknown
          viewowner?: unknown
        }
        Update: {
          definition?: string | null
          schemaname?: unknown
          viewname?: unknown
          viewowner?: unknown
        }
        Relationships: []
      }
      account_deletion_audit: {
        Row: {
          event: string
          id: number
          metadata: Json
          occurred_at: string
          user_id_hash: string
        }
        Insert: {
          event: string
          id?: number
          metadata?: Json
          occurred_at?: string
          user_id_hash: string
        }
        Update: {
          event?: string
          id?: number
          metadata?: Json
          occurred_at?: string
          user_id_hash?: string
        }
        Relationships: []
      }
      accounts: {
        Row: {
          balance: number | null
          color: string | null
          created_at: string | null
          currency: string | null
          icon: string | null
          id: string
          initial_balance: number | null
          is_active: boolean | null
          name: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          color?: string | null
          created_at?: string | null
          currency?: string | null
          icon?: string | null
          id?: string
          initial_balance?: number | null
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          color?: string | null
          created_at?: string | null
          currency?: string | null
          icon?: string | null
          id?: string
          initial_balance?: number | null
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      allocations: {
        Row: {
          alert_enabled: boolean | null
          alert_threshold: number | null
          amount: number
          budget_id: string
          category_id: string | null
          created_at: string | null
          goal_id: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          alert_enabled?: boolean | null
          alert_threshold?: number | null
          amount: number
          budget_id: string
          category_id?: string | null
          created_at?: string | null
          goal_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          alert_enabled?: boolean | null
          alert_threshold?: number | null
          amount?: number
          budget_id?: string
          category_id?: string | null
          created_at?: string | null
          goal_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "allocations_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_items_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "v_user_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_archive_reports: {
        Row: {
          ai_report: Json
          budget_id: string
          generated_at: string
          summary: Json
          user_id: string
        }
        Insert: {
          ai_report: Json
          budget_id: string
          generated_at?: string
          summary: Json
          user_id: string
        }
        Update: {
          ai_report?: Json
          budget_id?: string
          generated_at?: string
          summary?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_archive_reports_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: true
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          amount: number
          archived_at: string | null
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          period: string
          start_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          archived_at?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          period?: string
          start_date: string
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          amount?: number
          archived_at?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          period?: string
          start_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          category_type: string
          clerk_user_id: string | null
          color: string | null
          created_at: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_editable: boolean | null
          is_system: boolean | null
          is_visible: boolean | null
          name: string
          parent_id: string | null
          user_id: string | null
        }
        Insert: {
          category_type: string
          clerk_user_id?: string | null
          color?: string | null
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_editable?: boolean | null
          is_system?: boolean | null
          is_visible?: boolean | null
          name: string
          parent_id?: string | null
          user_id?: string | null
        }
        Update: {
          category_type?: string
          clerk_user_id?: string | null
          color?: string | null
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_editable?: boolean | null
          is_system?: boolean | null
          is_visible?: boolean | null
          name?: string
          parent_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "v_user_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      debt_payments: {
        Row: {
          amount_paid: number
          created_at: string | null
          debt_id: string
          id: string
          interest_paid: number
          notes: string | null
          payment_date: string
          principal_paid: number
          user_id: string
        }
        Insert: {
          amount_paid: number
          created_at?: string | null
          debt_id: string
          id?: string
          interest_paid: number
          notes?: string | null
          payment_date: string
          principal_paid: number
          user_id?: string
        }
        Update: {
          amount_paid?: number
          created_at?: string | null
          debt_id?: string
          id?: string
          interest_paid?: number
          notes?: string | null
          payment_date?: string
          principal_paid?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "debt_payments_debt_id_fkey"
            columns: ["debt_id"]
            isOneToOne: false
            referencedRelation: "debts"
            referencedColumns: ["id"]
          },
        ]
      }
      debts: {
        Row: {
          created_at: string | null
          current_balance: number
          id: string
          interest_rate: number
          is_active: boolean | null
          minimum_payment: number
          name: string
          principal_amount: number
          start_date: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_balance: number
          id?: string
          interest_rate: number
          is_active?: boolean | null
          minimum_payment: number
          name: string
          principal_amount: number
          start_date: string
          type: string
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          current_balance?: number
          id?: string
          interest_rate?: number
          is_active?: boolean | null
          minimum_payment?: number
          name?: string
          principal_amount?: number
          start_date?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          achieved_date: string | null
          category: string | null
          created_at: string | null
          current_amount: number | null
          id: string
          is_achieved: boolean | null
          name: string
          notes: string | null
          target_amount: number
          target_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achieved_date?: string | null
          category?: string | null
          created_at?: string | null
          current_amount?: number | null
          id?: string
          is_achieved?: boolean | null
          name: string
          notes?: string | null
          target_amount: number
          target_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          achieved_date?: string | null
          category?: string | null
          created_at?: string | null
          current_amount?: number | null
          id?: string
          is_achieved?: boolean | null
          name?: string
          notes?: string | null
          target_amount?: number
          target_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pending_emails: {
        Row: {
          attempts: number
          created_at: string
          id: number
          last_attempted_at: string | null
          last_error: string | null
          max_attempts: number
          next_run_at: string
          payload: Json
          sent_at: string | null
          template: string
          to_email: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          id?: number
          last_attempted_at?: string | null
          last_error?: string | null
          max_attempts?: number
          next_run_at?: string
          payload?: Json
          sent_at?: string | null
          template: string
          to_email: string
        }
        Update: {
          attempts?: number
          created_at?: string
          id?: number
          last_attempted_at?: string | null
          last_error?: string | null
          max_attempts?: number
          next_run_at?: string
          payload?: Json
          sent_at?: string | null
          template?: string
          to_email?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          clerk_user_id: string | null
          created_at: string | null
          currency: string | null
          email: string
          full_name: string | null
          id: string
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          clerk_user_id?: string | null
          created_at?: string | null
          currency?: string | null
          email: string
          full_name?: string | null
          id?: string
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          clerk_user_id?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string
          full_name?: string | null
          id?: string
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recurring_transactions: {
        Row: {
          account_id: string | null
          amount: number
          billing_day: number | null
          category_id: string | null
          created_at: string | null
          currency: string | null
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean | null
          is_paused: boolean | null
          last_processed: string | null
          name: string
          next_occurrence: string
          note: string | null
          notify_before_days: number | null
          notify_enabled: boolean | null
          service_template_id: string | null
          start_date: string
          tags: string[] | null
          times_processed: number | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          billing_day?: number | null
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          end_date?: string | null
          frequency: string
          id?: string
          is_active?: boolean | null
          is_paused?: boolean | null
          last_processed?: string | null
          name: string
          next_occurrence: string
          note?: string | null
          notify_before_days?: number | null
          notify_enabled?: boolean | null
          service_template_id?: string | null
          start_date: string
          tags?: string[] | null
          times_processed?: number | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          billing_day?: number | null
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          is_paused?: boolean | null
          last_processed?: string | null
          name?: string
          next_occurrence?: string
          note?: string | null
          notify_before_days?: number | null
          notify_enabled?: boolean | null
          service_template_id?: string | null
          start_date?: string
          tags?: string[] | null
          times_processed?: number | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "v_user_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_transactions_service_template_id_fkey"
            columns: ["service_template_id"]
            isOneToOne: false
            referencedRelation: "service_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      service_templates: {
        Row: {
          billing_cycle: string | null
          category_id: string | null
          country_code: string
          created_at: string | null
          currency: string
          default_amount: number | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          last_price_update: string | null
          localized_amount: number
          logo_url: string | null
          name: string
          price_selector: string | null
          service_type: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          billing_cycle?: string | null
          category_id?: string | null
          country_code: string
          created_at?: string | null
          currency?: string
          default_amount?: number | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          last_price_update?: string | null
          localized_amount: number
          logo_url?: string | null
          name: string
          price_selector?: string | null
          service_type: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          billing_cycle?: string | null
          category_id?: string | null
          country_code?: string
          created_at?: string | null
          currency?: string
          default_amount?: number | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          last_price_update?: string | null
          localized_amount?: number
          logo_url?: string | null
          name?: string
          price_selector?: string | null
          service_type?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "v_user_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          budget_id: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          goal_id: string | null
          id: string
          is_recurring: boolean | null
          merchant: string | null
          note: string | null
          recurring_id: string | null
          tags: string[] | null
          transaction_date: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          budget_id?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          goal_id?: string | null
          id?: string
          is_recurring?: boolean | null
          merchant?: string | null
          note?: string | null
          recurring_id?: string | null
          tags?: string[] | null
          transaction_date?: string
          type: string
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          budget_id?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          goal_id?: string | null
          id?: string
          is_recurring?: boolean | null
          merchant?: string | null
          note?: string | null
          recurring_id?: string | null
          tags?: string[] | null
          transaction_date?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "v_user_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_recurring_id_fkey"
            columns: ["recurring_id"]
            isOneToOne: false
            referencedRelation: "recurring_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          dark_mode: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dark_mode?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          dark_mode?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          received_at: string
          svix_id: string
        }
        Insert: {
          received_at?: string
          svix_id: string
        }
        Update: {
          received_at?: string
          svix_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_upcoming_recurring: {
        Row: {}
        Relationships: []
      }
      v_user_categories: {
        Row: {
          category_source: string | null
          color: string | null
          created_at: string | null
          display_order: number | null
          icon: string | null
          id: string | null
          is_editable: boolean | null
          is_system: boolean | null
          is_visible: boolean | null
          name: string | null
          parent_id: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          category_source?: never
          color?: string | null
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string | null
          is_editable?: boolean | null
          is_system?: boolean | null
          is_visible?: boolean | null
          name?: string | null
          parent_id?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          category_source?: never
          color?: string | null
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string | null
          is_editable?: boolean | null
          is_system?: boolean | null
          is_visible?: boolean | null
          name?: string | null
          parent_id?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "v_user_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_next_occurrence: {
        Args: {
          p_billing_day?: number
          p_current_date: string
          p_frequency: string
        }
        Returns: string
      }
      claim_pending_email: {
        Args: { p_id: number }
        Returns: {
          attempts: number
          created_at: string
          id: number
          last_attempted_at: string | null
          last_error: string | null
          max_attempts: number
          next_run_at: string
          payload: Json
          sent_at: string | null
          template: string
          to_email: string
        }[]
        SetofOptions: {
          from: '*'
          to: 'pending_emails'
          isOneToOne: false
          isSetofReturn: true
        }
      }
      delete_user_data: {
        Args: { p_clerk_user_id: string }
        Returns: undefined
      }
      drop_inactive_electric_replication_slots: { Args: never; Returns: number }
      fetch_ready_pending_emails: {
        Args: { p_limit: number }
        Returns: {
          attempts: number
          created_at: string
          id: number
          last_attempted_at: string | null
          last_error: string | null
          max_attempts: number
          next_run_at: string
          payload: Json
          sent_at: string | null
          template: string
          to_email: string
        }[]
        SetofOptions: {
          from: '*'
          to: 'pending_emails'
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_budgets_overview: {
        Args: never
        Returns: {
          budget_amount: number
          budget_id: string
          budget_name: string
          end_date: string
          is_active: boolean
          period: string
          start_date: string
          total_spent: number
        }[]
      }
      get_budgets_with_progress: {
        Args: never
        Returns: {
          alert_enabled: boolean
          alert_threshold: number
          allocation_id: string
          amount: number
          budget_amount: number
          budget_id: string
          budget_name: string
          category_color: string
          category_icon: string
          category_id: string
          category_name: string
          category_type: string
          end_date: string
          goal_id: string
          goal_name: string
          is_active: boolean
          period: string
          progress: number
          start_date: string
        }[]
      }
      get_goals_with_progress: {
        Args: never
        Returns: {
          achieved_date: string
          budget_contributions: number
          category: string
          created_at: string
          current_amount: number
          direct_contributions: number
          id: string
          is_achieved: boolean
          name: string
          notes: string
          target_amount: number
          target_date: string
        }[]
      }
      get_transactions_with_categories: {
        Args: { p_budget_id: string }
        Returns: {
          amount: number
          category_id: string
          category_type: string
          color: string
          description: string
          icon: string
          id: string
          is_recurring: boolean
          name: string
          transaction_date: string
        }[]
      }
      process_recurring_transactions: {
        Args: never
        Returns: {
          amount: number
          processed_date: string
          recurring_id: string
          transaction_id: string
        }[]
      }
      record_debt_payment: {
        Args: {
          p_amount_paid: number
          p_debt_id: string
          p_interest_paid: number
          p_notes?: string
          p_payment_date: string
          p_principal_paid: number
        }
        Returns: undefined
      }
      record_pending_email_failure: {
        Args: { p_error: string; p_id: number }
        Returns: undefined
      }
      terminate_idle_electric_connections: {
        Args: { idle_threshold?: string }
        Returns: number
      }
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
