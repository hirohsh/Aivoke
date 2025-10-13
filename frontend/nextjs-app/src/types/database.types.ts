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
      api_key_settings: {
        Row: {
          api_provider: number | null
          created_at: string
          storage: Database["public"]["Enums"]["storage_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          api_provider?: number | null
          created_at?: string
          storage?: Database["public"]["Enums"]["storage_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          api_provider?: number | null
          created_at?: string
          storage?: Database["public"]["Enums"]["storage_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_key_settings_api_provider_fkey"
            columns: ["api_provider"]
            isOneToOne: false
            referencedRelation: "api_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      api_providers: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      conversation_summaries: {
        Row: {
          conversation_id: string
          summary: string
          up_to_message_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          summary: string
          up_to_message_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          summary?: string
          up_to_message_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_summaries_up_to_message_fk"
            columns: ["up_to_message_id", "conversation_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id", "conversation_id"]
          },
        ]
      }
      conversations: {
        Row: {
          archived_at: string | null
          created_at: string
          deleted_at: string | null
          id: string
          model: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          model?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          model?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: Json
          conversation_id: string
          created_at: string
          deleted_at: string | null
          id: string
          reply_to: string | null
          role: Database["public"]["Enums"]["message_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          content: Json
          conversation_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          reply_to?: string | null
          role: Database["public"]["Enums"]["message_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          conversation_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          reply_to?: string | null
          role?: Database["public"]["Enums"]["message_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      token_usage: {
        Row: {
          completion_tokens: number
          conversation_id: string | null
          cost_cents: number
          created_at: string
          id: number
          message_id: string | null
          model: string
          prompt_tokens: number
          user_id: string
        }
        Insert: {
          completion_tokens?: number
          conversation_id?: string | null
          cost_cents?: number
          created_at?: string
          id?: number
          message_id?: string | null
          model: string
          prompt_tokens?: number
          user_id: string
        }
        Update: {
          completion_tokens?: number
          conversation_id?: string | null
          cost_cents?: number
          created_at?: string
          id?: number
          message_id?: string | null
          model?: string
          prompt_tokens?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_usage_message_fk"
            columns: ["message_id", "conversation_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id", "conversation_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_api_key_setting_and_secret: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      get_api_key_secret: {
        Args: { p_user_id: string }
        Returns: string
      }
      get_user_provider_name: {
        Args: { p_user_id: string }
        Returns: string
      }
      get_user_settings: {
        Args: { p_user_id: string }
        Returns: {
          provider_name: string
          storage: Database["public"]["Enums"]["storage_type"]
        }[]
      }
      is_service_role: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      rpc_archive_conversation: {
        Args: {
          p_archived: boolean
          p_conversation_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      rpc_create_conversation: {
        Args: { p_model?: string; p_title?: string; p_user_id: string }
        Returns: string
      }
      rpc_create_message: {
        Args: {
          p_content: Json
          p_conversation_id: string
          p_reply_to?: string
          p_role: Database["public"]["Enums"]["message_role"]
          p_user_id: string
        }
        Returns: string
      }
      rpc_delete_conversation: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: undefined
      }
      rpc_get_conversation_summary: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: {
          conversation_id: string
          summary: string
          up_to_message_id: string
          updated_at: string
        }[]
      }
      rpc_insert_token_usage: {
        Args: {
          p_completion_tokens: number
          p_conversation_id: string
          p_cost_cents: number
          p_message_id: string
          p_model: string
          p_prompt_tokens: number
          p_user_id: string
        }
        Returns: number
      }
      rpc_list_conversations: {
        Args: { p_cursor?: string; p_limit?: number; p_user_id: string }
        Returns: Database["public"]["CompositeTypes"]["conversation_list"][]
      }
      rpc_list_messages: {
        Args: {
          p_after?: string
          p_conversation_id: string
          p_limit?: number
          p_user_id: string
        }
        Returns: {
          content: Json
          conversation_id: string
          created_at: string
          id: string
          model: string
          reply_to: string
          role: Database["public"]["Enums"]["message_role"]
          updated_at: string
        }[]
      }
      rpc_list_messages_after_summary: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: {
          content: Json
          conversation_id: string
          created_at: string
          id: string
          model: string
          reply_to: string
          role: Database["public"]["Enums"]["message_role"]
          updated_at: string
        }[]
      }
      rpc_sum_token_usage: {
        Args: { p_from: string; p_to: string; p_user_id: string }
        Returns: {
          completion_tokens: number
          cost_cents: number
          model: string
          prompt_tokens: number
        }[]
      }
      rpc_update_conversation_title: {
        Args: { p_conversation_id: string; p_title: string; p_user_id: string }
        Returns: undefined
      }
      rpc_upsert_conversation_summary: {
        Args: {
          p_conversation_id: string
          p_summary: string
          p_up_to_message_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      upsert_api_key_setting_and_secret: {
        Args: { p_api_key: string; p_api_provider: number; p_user_id: string }
        Returns: undefined
      }
      upsert_api_key_setting_local: {
        Args: { p_api_provider: number; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      message_role: "system" | "user" | "assistant" | "tool"
      storage_type: "local" | "server"
    }
    CompositeTypes: {
      conversation_list: {
        id: string | null
        title: string | null
        model: string | null
        created_at: string | null
      }
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
      message_role: ["system", "user", "assistant", "tool"],
      storage_type: ["local", "server"],
    },
  },
} as const

