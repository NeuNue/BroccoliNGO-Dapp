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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      Config: {
        Row: {
          id: number
          key: string | null
          value: string | null
        }
        Insert: {
          id?: number
          key?: string | null
          value?: string | null
        }
        Update: {
          id?: number
          key?: string | null
          value?: string | null
        }
        Relationships: []
      }
      DuneExecution: {
        Row: {
          created_at: string
          date: string | null
          executionId: string | null
          id: number
          queryId: string | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          executionId?: string | null
          id?: number
          queryId?: string | null
        }
        Update: {
          created_at?: string
          date?: string | null
          executionId?: string | null
          id?: number
          queryId?: string | null
        }
        Relationships: []
      }
      Event: {
        Row: {
          block: number | null
          created_at: string
          data: string | null
          hash: string | null
          id: number
          status: number | null
          timestamp: number | null
          topic: string | null
          txIndex: number | null
        }
        Insert: {
          block?: number | null
          created_at?: string
          data?: string | null
          hash?: string | null
          id?: number
          status?: number | null
          timestamp?: number | null
          topic?: string | null
          txIndex?: number | null
        }
        Update: {
          block?: number | null
          created_at?: string
          data?: string | null
          hash?: string | null
          id?: number
          status?: number | null
          timestamp?: number | null
          topic?: string | null
          txIndex?: number | null
        }
        Relationships: []
      }
      Fund: {
        Row: {
          amount: string | null
          created_at: string
          eventId: number | null
          id: number
          nftId: number | null
          URI: string | null
        }
        Insert: {
          amount?: string | null
          created_at: string
          eventId?: number | null
          id?: number
          nftId?: number | null
          URI?: string | null
        }
        Update: {
          amount?: string | null
          created_at?: string
          eventId?: number | null
          id?: number
          nftId?: number | null
          URI?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Fund_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: true
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Fund_nftId_fkey"
            columns: ["nftId"]
            isOneToOne: false
            referencedRelation: "Task"
            referencedColumns: ["nftId"]
          },
        ]
      }
      PrivyUser: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          firstVerifiedAt: string | null
          id: number
          latestVerifiedAt: string | null
          updated_at: string | null
          userId: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          firstVerifiedAt?: string | null
          id?: number
          latestVerifiedAt?: string | null
          updated_at?: string | null
          userId: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          firstVerifiedAt?: string | null
          id?: number
          latestVerifiedAt?: string | null
          updated_at?: string | null
          userId?: string
        }
        Relationships: []
      }
      Proof: {
        Row: {
          created_at: string
          eventId: number | null
          id: number
          nftId: number | null
          URI: string | null
        }
        Insert: {
          created_at: string
          eventId?: number | null
          id?: number
          nftId?: number | null
          URI?: string | null
        }
        Update: {
          created_at?: string
          eventId?: number | null
          id?: number
          nftId?: number | null
          URI?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Proof_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: true
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Proof_nftId_fkey"
            columns: ["nftId"]
            isOneToOne: false
            referencedRelation: "Task"
            referencedColumns: ["nftId"]
          },
        ]
      }
      Task: {
        Row: {
          address: string | null
          approved: number | null
          approveEventId: number | null
          created_at: string
          creatEventId: number | null
          desc: string | null
          email: string | null
          helpPics: string | null
          id: number
          image: string | null
          location: string | null
          metadata: Json | null
          metadata_en: Json | null
          metadata_zh: Json | null
          nftId: number | null
          socialLink: string | null
          status: number | null
          title: string | null
          URI: string | null
          vote_end_date: string | null
          vote_start_date: string | null
          xHandle: string | null
        }
        Insert: {
          address?: string | null
          approved?: number | null
          approveEventId?: number | null
          created_at: string
          creatEventId?: number | null
          desc?: string | null
          email?: string | null
          helpPics?: string | null
          id?: number
          image?: string | null
          location?: string | null
          metadata?: Json | null
          metadata_en?: Json | null
          metadata_zh?: Json | null
          nftId?: number | null
          socialLink?: string | null
          status?: number | null
          title?: string | null
          URI?: string | null
          vote_end_date?: string | null
          vote_start_date?: string | null
          xHandle?: string | null
        }
        Update: {
          address?: string | null
          approved?: number | null
          approveEventId?: number | null
          created_at?: string
          creatEventId?: number | null
          desc?: string | null
          email?: string | null
          helpPics?: string | null
          id?: number
          image?: string | null
          location?: string | null
          metadata?: Json | null
          metadata_en?: Json | null
          metadata_zh?: Json | null
          nftId?: number | null
          socialLink?: string | null
          status?: number | null
          title?: string | null
          URI?: string | null
          vote_end_date?: string | null
          vote_start_date?: string | null
          xHandle?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Task_approveEventId_fkey"
            columns: ["approveEventId"]
            isOneToOne: true
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Task_creatEventId_fkey"
            columns: ["creatEventId"]
            isOneToOne: true
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
        ]
      }
      Test: {
        Row: {
          created_at: string
          id: number
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          value?: string | null
        }
        Relationships: []
      }
      User: {
        Row: {
          created_at: string
          email: string | null
          firstVerifiedAt: string | null
          id: number
          latestVerifiedAt: string | null
          privyId: string | null
          verifiedAt: string | null
          xAccessToken: string | null
          xAvatar: string | null
          xName: string | null
          xRefreshToken: string | null
          xTokenExpire: number | null
          xUid: string | null
          xUserName: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          firstVerifiedAt?: string | null
          id?: number
          latestVerifiedAt?: string | null
          privyId?: string | null
          verifiedAt?: string | null
          xAccessToken?: string | null
          xAvatar?: string | null
          xName?: string | null
          xRefreshToken?: string | null
          xTokenExpire?: number | null
          xUid?: string | null
          xUserName?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          firstVerifiedAt?: string | null
          id?: number
          latestVerifiedAt?: string | null
          privyId?: string | null
          verifiedAt?: string | null
          xAccessToken?: string | null
          xAvatar?: string | null
          xName?: string | null
          xRefreshToken?: string | null
          xTokenExpire?: number | null
          xUid?: string | null
          xUserName?: string | null
        }
        Relationships: []
      }
      Vote: {
        Row: {
          address: string | null
          balance: number | null
          created_at: string
          id: number
          nftId: number | null
          result: number | null
          sign: string | null
        }
        Insert: {
          address?: string | null
          balance?: number | null
          created_at?: string
          id?: number
          nftId?: number | null
          result?: number | null
          sign?: string | null
        }
        Update: {
          address?: string | null
          balance?: number | null
          created_at?: string
          id?: number
          nftId?: number | null
          result?: number | null
          sign?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vote_nftId_fkey"
            columns: ["nftId"]
            isOneToOne: false
            referencedRelation: "Task"
            referencedColumns: ["nftId"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_vote_result: {
        Args: { p_nftid: number }
        Returns: {
          result: number
          ticket: number
        }[]
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
    Enums: {},
  },
} as const
