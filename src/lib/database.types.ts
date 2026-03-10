export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agencies: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string
          verified: boolean | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          verified?: boolean | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_official_response: boolean | null
          report_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_official_response?: boolean | null
          report_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_official_response?: boolean | null
          report_id?: string
          user_id?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          citizen_credits: number | null
          created_at: string | null
          follower_count: number | null
          following_count: number | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          citizen_credits?: number | null
          created_at?: string | null
          follower_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          citizen_credits?: number | null
          created_at?: string | null
          follower_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      report_likes: {
        Row: {
          created_at: string | null
          id: string
          report_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          report_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          report_id?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          address: string | null
          agency_id: string | null
          comments_count: number | null
          county: string | null
          created_at: string | null
          description: string
          heat_score: number | null
          id: string
          image_url: string | null
          location: unknown
          severity: string | null
          shares_count: number | null
          status: string | null
          title: string
          updated_at: string | null
          upvotes_count: number | null
          user_id: string
        }
        Insert: {
          address?: string | null
          agency_id?: string | null
          comments_count?: number | null
          county?: string | null
          created_at?: string | null
          description: string
          heat_score?: number | null
          id?: string
          image_url?: string | null
          location?: unknown
          severity?: string | null
          shares_count?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
          upvotes_count?: number | null
          user_id: string
        }
        Update: {
          address?: string | null
          agency_id?: string | null
          comments_count?: number | null
          county?: string | null
          created_at?: string | null
          description?: string
          heat_score?: number | null
          id?: string
          image_url?: string | null
          location?: unknown
          severity?: string | null
          shares_count?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
          upvotes_count?: number | null
          user_id?: string
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

// Helper types for easy use
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
