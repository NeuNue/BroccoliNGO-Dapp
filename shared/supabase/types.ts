export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      Config: {
        Row: {
          id: number;
          key: string | null;
          value: string | null;
        };
        Insert: {
          id?: number;
          key?: string | null;
          value?: string | null;
        };
        Update: {
          id?: number;
          key?: string | null;
          value?: string | null;
        };
        Relationships: [];
      };
      DuneExecution: {
        Row: {
          created_at: string;
          date: string | null;
          executionId: string | null;
          id: number;
          queryId: string | null;
        };
        Insert: {
          created_at?: string;
          date?: string | null;
          executionId?: string | null;
          id?: number;
          queryId?: string | null;
        };
        Update: {
          created_at?: string;
          date?: string | null;
          executionId?: string | null;
          id?: number;
          queryId?: string | null;
        };
        Relationships: [];
      };
      Event: {
        Row: {
          block: number | null;
          created_at: string;
          data: string | null;
          hash: string | null;
          id: number;
          status: number | null;
          timestamp: number | null;
          topic: string | null;
          txIndex: number | null;
        };
        Insert: {
          block?: number | null;
          created_at?: string;
          data?: string | null;
          hash?: string | null;
          id?: number;
          status?: number | null;
          timestamp?: number | null;
          topic?: string | null;
          txIndex?: number | null;
        };
        Update: {
          block?: number | null;
          created_at?: string;
          data?: string | null;
          hash?: string | null;
          id?: number;
          status?: number | null;
          timestamp?: number | null;
          topic?: string | null;
          txIndex?: number | null;
        };
        Relationships: [];
      };
      Fund: {
        Row: {
          amount: string | null;
          created_at: string;
          eventId: number | null;
          id: number;
          nftId: number | null;
          URI: string | null;
        };
        Insert: {
          amount?: string | null;
          created_at: string;
          eventId?: number | null;
          id?: number;
          nftId?: number | null;
          URI?: string | null;
        };
        Update: {
          amount?: string | null;
          created_at?: string;
          eventId?: number | null;
          id?: number;
          nftId?: number | null;
          URI?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Fund_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: true;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Fund_nftId_fkey";
            columns: ["nftId"];
            isOneToOne: false;
            referencedRelation: "Task";
            referencedColumns: ["nftId"];
          }
        ];
      };
      Proof: {
        Row: {
          created_at: string;
          eventId: number | null;
          id: number;
          nftId: number | null;
          URI: string | null;
        };
        Insert: {
          created_at: string;
          eventId?: number | null;
          id?: number;
          nftId?: number | null;
          URI?: string | null;
        };
        Update: {
          created_at?: string;
          eventId?: number | null;
          id?: number;
          nftId?: number | null;
          URI?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Proof_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: true;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Proof_nftId_fkey";
            columns: ["nftId"];
            isOneToOne: false;
            referencedRelation: "Task";
            referencedColumns: ["nftId"];
          }
        ];
      };
      Task: {
        Row: {
          address: string | null;
          approved: number | null;
          approveEventId: number | null;
          created_at: string;
          creatEventId: number | null;
          desc: string | null;
          helpPics: string | null;
          id: number;
          image: string | null;
          location: string | null;
          metadata: Json | null;
          nftId: number | null;
          socialLink: string | null;
          status: number | null;
          title: string | null;
          URI: string | null;
          vote_end_date: string | null;
          vote_start_date: string | null;
          xHandle: string | null;
        };
        Insert: {
          address?: string | null;
          approved?: number | null;
          approveEventId?: number | null;
          created_at: string;
          creatEventId?: number | null;
          desc?: string | null;
          helpPics?: string | null;
          id?: number;
          image?: string | null;
          location?: string | null;
          metadata?: Json | null;
          nftId?: number | null;
          socialLink?: string | null;
          status?: number | null;
          title?: string | null;
          URI?: string | null;
          vote_end_date?: string | null;
          vote_start_date?: string | null;
          xHandle?: string | null;
        };
        Update: {
          address?: string | null;
          approved?: number | null;
          approveEventId?: number | null;
          created_at?: string;
          creatEventId?: number | null;
          desc?: string | null;
          helpPics?: string | null;
          id?: number;
          image?: string | null;
          location?: string | null;
          metadata?: Json | null;
          nftId?: number | null;
          socialLink?: string | null;
          status?: number | null;
          title?: string | null;
          URI?: string | null;
          vote_end_date?: string | null;
          vote_start_date?: string | null;
          xHandle?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Task_approveEventId_fkey";
            columns: ["approveEventId"];
            isOneToOne: true;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Task_creatEventId_fkey";
            columns: ["creatEventId"];
            isOneToOne: true;
            referencedRelation: "Event";
            referencedColumns: ["id"];
          }
        ];
      };
      User: {
        Row: {
          created_at: string;
          id: number;
          xAccessToken: string | null;
          xAvatar: string | null;
          xName: string | null;
          xRefreshToken: string | null;
          xTokenExpire: number | null;
          xUid: string | null;
          xUserName: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          xAccessToken?: string | null;
          xAvatar?: string | null;
          xName?: string | null;
          xRefreshToken?: string | null;
          xTokenExpire?: number | null;
          xUid?: string | null;
          xUserName?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          xAccessToken?: string | null;
          xAvatar?: string | null;
          xName?: string | null;
          xRefreshToken?: string | null;
          xTokenExpire?: number | null;
          xUid?: string | null;
          xUserName?: string | null;
        };
        Relationships: [];
      };
      Vote: {
        Row: {
          address: string | null;
          balance: number | null;
          created_at: string;
          id: number;
          nftId: number | null;
          result: number | null;
          sign: string | null;
        };
        Insert: {
          address?: string | null;
          balance?: number | null;
          created_at?: string;
          id?: number;
          nftId?: number | null;
          result?: number | null;
          sign?: string | null;
        };
        Update: {
          address?: string | null;
          balance?: number | null;
          created_at?: string;
          id?: number;
          nftId?: number | null;
          result?: number | null;
          sign?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "vote_nftId_fkey";
            columns: ["nftId"];
            isOneToOne: false;
            referencedRelation: "Task";
            referencedColumns: ["nftId"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_vote_result: {
        Args: {
          p_nftid: number;
        };
        Returns: {
          result: number;
          ticket: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
