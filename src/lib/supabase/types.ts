// Database types — replace with generated types from `supabase gen types typescript`

export type ApprovalStatus = "draft" | "pending_review" | "approved" | "rejected";
export type UserRole = "admin" | "guitarist";
export type SocialPlatform = "facebook" | "instagram" | "youtube" | "tiktok" | "spotify" | "website" | "x" | "other";
export type GearCategory =
  | "acoustic_guitar" | "classical_guitar" | "strings" | "capo" | "tuner"
  | "pickup" | "microphone" | "audio_interface" | "amp" | "cable" | "stand" | "accessory";
export type ArticleStatus = "draft" | "published" | "archived";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      guitarists: {
        Row: {
          id: string;
          user_id: string | null;
          slug: string;
          display_name: string;
          real_name: string | null;
          location: string | null;
          bio_short: string;
          bio_full: string | null;
          profile_photo_url: string | null;
          youtube_channel_url: string | null;
          contact_email: string | null;
          approval_status: ApprovalStatus;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          slug: string;
          display_name: string;
          real_name?: string | null;
          location?: string | null;
          bio_short: string;
          bio_full?: string | null;
          profile_photo_url?: string | null;
          youtube_channel_url?: string | null;
          contact_email?: string | null;
          approval_status?: ApprovalStatus;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          slug?: string;
          display_name?: string;
          real_name?: string | null;
          location?: string | null;
          bio_short?: string;
          bio_full?: string | null;
          profile_photo_url?: string | null;
          youtube_channel_url?: string | null;
          contact_email?: string | null;
          approval_status?: ApprovalStatus;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      guitarist_videos: {
        Row: {
          id: string;
          guitarist_id: string;
          youtube_url: string;
          title: string | null;
          thumbnail_url: string | null;
          featured_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          guitarist_id: string;
          youtube_url: string;
          title?: string | null;
          thumbnail_url?: string | null;
          featured_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          guitarist_id?: string;
          youtube_url?: string;
          title?: string | null;
          thumbnail_url?: string | null;
          featured_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "guitarist_videos_guitarist_id_fkey";
            columns: ["guitarist_id"];
            isOneToOne: false;
            referencedRelation: "guitarists";
            referencedColumns: ["id"];
          },
        ];
      };
      tablature_links: {
        Row: {
          id: string;
          guitarist_id: string;
          title: string;
          song_name: string | null;
          source_label: string | null;
          external_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          guitarist_id: string;
          title: string;
          song_name?: string | null;
          source_label?: string | null;
          external_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          guitarist_id?: string;
          title?: string;
          song_name?: string | null;
          source_label?: string | null;
          external_url?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tablature_links_guitarist_id_fkey";
            columns: ["guitarist_id"];
            isOneToOne: false;
            referencedRelation: "guitarists";
            referencedColumns: ["id"];
          },
        ];
      };
      social_links: {
        Row: {
          id: string;
          guitarist_id: string;
          platform: SocialPlatform;
          external_url: string;
        };
        Insert: {
          id?: string;
          guitarist_id: string;
          platform: SocialPlatform;
          external_url: string;
        };
        Update: {
          id?: string;
          guitarist_id?: string;
          platform?: SocialPlatform;
          external_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "social_links_guitarist_id_fkey";
            columns: ["guitarist_id"];
            isOneToOne: false;
            referencedRelation: "guitarists";
            referencedColumns: ["id"];
          },
        ];
      };
      gear_products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          brand: string | null;
          category: GearCategory;
          short_description: string | null;
          image_url: string | null;
          external_url: string | null;
          affiliate_url: string | null;
          sponsored: boolean;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          brand?: string | null;
          category: GearCategory;
          short_description?: string | null;
          image_url?: string | null;
          external_url?: string | null;
          affiliate_url?: string | null;
          sponsored?: boolean;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          brand?: string | null;
          category?: GearCategory;
          short_description?: string | null;
          image_url?: string | null;
          external_url?: string | null;
          affiliate_url?: string | null;
          sponsored?: boolean;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          body: string;
          featured_image_url: string | null;
          status: ArticleStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          body: string;
          featured_image_url?: string | null;
          status?: ArticleStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          body?: string;
          featured_image_url?: string | null;
          status?: ArticleStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      my_guitarist_id: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: {
      approval_status: ApprovalStatus;
      user_role: UserRole;
      social_platform: SocialPlatform;
      gear_category: GearCategory;
      article_status: ArticleStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

// Convenience type aliases
export type Guitarist = Database["public"]["Tables"]["guitarists"]["Row"];
export type GuitaristVideo = Database["public"]["Tables"]["guitarist_videos"]["Row"];
export type TablatureLink = Database["public"]["Tables"]["tablature_links"]["Row"];
export type SocialLink = Database["public"]["Tables"]["social_links"]["Row"];
export type GearProduct = Database["public"]["Tables"]["gear_products"]["Row"];
export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
