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
          query?: string
          variables?: Json
          extensions?: Json
          operationName?: string
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
          updated_at: string
          user_id: string
        }
        Insert: {
          api_provider?: number | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_provider?: number | null
          created_at?: string
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
        }[]
      }
      is_service_role: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      rpc_archive_conversation: {
        Args: {
          p_conversation_id: string
          p_archived: boolean
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
          p_role: Database["public"]["Enums"]["message_role"]
          p_conversation_id: string
          p_user_id: string
          p_content: Json
          p_reply_to?: string
        }
        Returns: string
      }
      rpc_delete_conversation: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: undefined
      }
      rpc_get_conversation_summary: {
        Args: { p_user_id: string; p_conversation_id: string }
        Returns: {
          summary: string
          conversation_id: string
          updated_at: string
          up_to_message_id: string
        }[]
      }
      rpc_insert_token_usage: {
        Args: {
          p_user_id: string
          p_cost_cents: number
          p_completion_tokens: number
          p_prompt_tokens: number
          p_model: string
          p_message_id: string
          p_conversation_id: string
        }
        Returns: number
      }
      rpc_list_conversations: {
        Args: { p_user_id: string; p_limit?: number; p_cursor?: string }
        Returns: Database["public"]["CompositeTypes"]["conversation_list"][]
      }
      rpc_list_messages: {
        Args: {
          p_conversation_id: string
          p_user_id: string
          p_limit?: number
          p_after?: string
        }
        Returns: {
          role: Database["public"]["Enums"]["message_role"]
          content: Json
          model: string
          reply_to: string
          created_at: string
          updated_at: string
          id: string
          conversation_id: string
        }[]
      }
      rpc_list_messages_after_summary: {
        Args: { p_user_id: string; p_conversation_id: string }
        Returns: {
          conversation_id: string
          content: Json
          model: string
          reply_to: string
          created_at: string
          updated_at: string
          id: string
          role: Database["public"]["Enums"]["message_role"]
        }[]
      }
      rpc_sum_token_usage: {
        Args: { p_user_id: string; p_from: string; p_to: string }
        Returns: {
          model: string
          prompt_tokens: number
          completion_tokens: number
          cost_cents: number
        }[]
      }
      rpc_update_conversation_title: {
        Args: { p_user_id: string; p_conversation_id: string; p_title: string }
        Returns: undefined
      }
      rpc_upsert_conversation_summary: {
        Args: {
          p_summary: string
          p_conversation_id: string
          p_user_id: string
          p_up_to_message_id: string
        }
        Returns: undefined
      }
      upsert_api_key_setting_and_secret: {
        Args: { p_user_id: string; p_api_key: string; p_api_provider: number }
        Returns: undefined
      }
    }
    Enums: {
      message_role: "system" | "user" | "assistant" | "tool"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      message_role: ["system", "user", "assistant", "tool"],
    },
  },
} as const

