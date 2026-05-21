export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      universities: {
        Row: {
          id: string;
          name: string;
          short_name: string;
          email_domain: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          short_name: string;
          email_domain?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["universities"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          display_name: string;
          bio: string | null;
          identity_group: string;
          age_range: string;
          university_id: string | null;
          verified_university: boolean;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          bio?: string | null;
          identity_group: string;
          age_range: string;
          university_id?: string | null;
          verified_university?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      interests: {
        Row: {
          id: string;
          name: string;
          subscriber_count: number;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          subscriber_count?: number;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["interests"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      identity_group: "child" | "university_student" | "adult";
      friendship_status: "pending" | "accepted" | "declined" | "blocked";
      chat_kind: "proximity" | "friend" | "community";
      community_privacy: "public" | "request";
      community_role: "member" | "lead";
      attendance_status: "interested" | "attending" | "declined";
      report_status: "open" | "reviewed" | "dismissed";
    };
    CompositeTypes: Record<string, never>;
  };
};
