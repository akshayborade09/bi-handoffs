/**
 * Database types for Supabase tables
 * These types match the database schema and ensure type safety
 */

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  google_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_image: string | null;
  page_id: string;
  position_x: number;
  position_y: number;
  content: string;
  resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Insert types (for creating new records)
 * Omits auto-generated fields like id, created_at, updated_at
 */
export type UserInsert = Omit<User, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type CommentInsert = Omit<Comment, "id" | "created_at" | "updated_at" | "resolved" | "resolved_at" | "resolved_by"> & {
  id?: string;
  resolved?: boolean;
  resolved_at?: string | null;
  resolved_by?: string | null;
  created_at?: string;
  updated_at?: string;
};

/**
 * Update types (for updating existing records)
 * All fields are optional except id
 */
export type UserUpdate = Partial<Omit<User, "id" | "created_at">> & {
  updated_at?: string;
};

export type CommentUpdate = Partial<Omit<Comment, "id" | "created_at">> & {
  updated_at?: string;
};

/**
 * Database schema type for use with Supabase client
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      comments: {
        Row: Comment;
        Insert: CommentInsert;
        Update: CommentUpdate;
      };
    };
  };
}
