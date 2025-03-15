export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          type: string
          address: string
          city: string
          state: string
          zip_code: string
          contact_name: string | null
          contact_phone: string | null
          contact_email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          address: string
          city: string
          state: string
          zip_code: string
          contact_name?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          contact_name?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inspections: {
        Row: {
          id: string
          client_id: string
          status: string
          inspection_date: string
          building_type: string
          construction_year: number | null
          roof_area: number
          last_maintenance: string | null
          main_issue: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          status?: string
          inspection_date: string
          building_type: string
          construction_year?: number | null
          roof_area: number
          last_maintenance?: string | null
          main_issue?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          status?: string
          inspection_date?: string
          building_type?: string
          construction_year?: number | null
          roof_area?: number
          last_maintenance?: string | null
          main_issue?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inspection_tiles: {
        Row: {
          id: string
          inspection_id: string
          line: string
          thickness: string
          dimensions: string
          quantity: number
          area: number
        }
        Insert: {
          id?: string
          inspection_id: string
          line: string
          thickness: string
          dimensions: string
          quantity: number
          area: number
        }
        Update: {
          id?: string
          inspection_id?: string
          line?: string
          thickness?: string
          dimensions?: string
          quantity?: number
          area?: number
        }
      }
      nonconformities: {
        Row: {
          id: string
          inspection_id: string
          title: string
          description: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          inspection_id: string
          title: string
          description: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          inspection_id?: string
          title?: string
          description?: string
          notes?: string | null
          created_at?: string
        }
      }
      inspection_photos: {
        Row: {
          id: string
          inspection_id: string
          nonconformity_id: string | null
          category: string
          caption: string
          photo_url: string
          created_at: string
        }
        Insert: {
          id?: string
          inspection_id: string
          nonconformity_id?: string | null
          category: string
          caption: string
          photo_url: string
          created_at?: string
        }
        Update: {
          id?: string
          inspection_id?: string
          nonconformity_id?: string | null
          category?: string
          caption?: string
          photo_url?: string
          created_at?: string
        }
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
  }
}