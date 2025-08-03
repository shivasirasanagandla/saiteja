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
      user_profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other' | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      delivery_zones: {
        Row: {
          id: string
          state: string
          district: string
          local_area: string
          pincode: string | null
          is_active: boolean
          delivery_fee: number
          min_order_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          state: string
          district: string
          local_area: string
          pincode?: string | null
          is_active?: boolean
          delivery_fee?: number
          min_order_amount?: number
          created_at?: string
        }
        Update: {
          id?: string
          state?: string
          district?: string
          local_area?: string
          pincode?: string | null
          is_active?: boolean
          delivery_fee?: number
          min_order_amount?: number
          created_at?: string
        }
      }
      user_addresses: {
        Row: {
          id: string
          user_id: string
          address_type: 'home' | 'office' | 'other'
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          district: string
          local_area: string
          pincode: string
          landmark: string | null
          is_default: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          address_type: 'home' | 'office' | 'other'
          address_line1: string
          address_line2?: string | null
          city: string
          state: string
          district: string
          local_area: string
          pincode: string
          landmark?: string | null
          is_default?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          address_type?: 'home' | 'office' | 'other'
          address_line1?: string
          address_line2?: string | null
          city?: string
          state?: string
          district?: string
          local_area?: string
          pincode?: string
          landmark?: string | null
          is_default?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          description: string | null
          image_url: string | null
          price: number
          original_price: number | null
          unit: string
          min_quantity: number
          max_quantity_per_order: number | null
          stock_quantity: number
          is_subscription_available: boolean
          is_featured: boolean
          is_active: boolean
          nutritional_info: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          description?: string | null
          image_url?: string | null
          price: number
          original_price?: number | null
          unit: string
          min_quantity?: number
          max_quantity_per_order?: number | null
          stock_quantity?: number
          is_subscription_available?: boolean
          is_featured?: boolean
          is_active?: boolean
          nutritional_info?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          image_url?: string | null
          price?: number
          original_price?: number | null
          unit?: string
          min_quantity?: number
          max_quantity_per_order?: number | null
          stock_quantity?: number
          is_subscription_available?: boolean
          is_featured?: boolean
          is_active?: boolean
          nutritional_info?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      user_cart: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          is_subscription: boolean
          subscription_frequency: 'daily' | 'weekly' | 'monthly' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          is_subscription?: boolean
          subscription_frequency?: 'daily' | 'weekly' | 'monthly' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          is_subscription?: boolean
          subscription_frequency?: 'daily' | 'weekly' | 'monthly' | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          order_type: 'one_time' | 'subscription'
          status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
          subtotal: number
          delivery_fee: number
          tax_amount: number
          total_amount: number
          payment_method: 'wallet' | 'cod' | 'online'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          delivery_address_id: string | null
          delivery_instructions: string | null
          scheduled_delivery_date: string | null
          scheduled_delivery_time: string | null
          actual_delivery_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number: string
          order_type?: 'one_time' | 'subscription'
          status?: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
          subtotal: number
          delivery_fee?: number
          tax_amount?: number
          total_amount: number
          payment_method: 'wallet' | 'cod' | 'online'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          delivery_address_id?: string | null
          delivery_instructions?: string | null
          scheduled_delivery_date?: string | null
          scheduled_delivery_time?: string | null
          actual_delivery_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          order_type?: 'one_time' | 'subscription'
          status?: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
          subtotal?: number
          delivery_fee?: number
          tax_amount?: number
          total_amount?: number
          payment_method?: 'wallet' | 'cod' | 'online'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          delivery_address_id?: string | null
          delivery_instructions?: string | null
          scheduled_delivery_date?: string | null
          scheduled_delivery_time?: string | null
          actual_delivery_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_price: number
          quantity: number
          unit: string
          total_price: number
          is_subscription: boolean
          subscription_frequency: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_price: number
          quantity: number
          unit: string
          total_price: number
          is_subscription?: boolean
          subscription_frequency?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_price?: number
          quantity?: number
          unit?: string
          total_price?: number
          is_subscription?: boolean
          subscription_frequency?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          order_id: string | null
          status: 'active' | 'paused' | 'cancelled' | 'expired'
          frequency: 'daily' | 'weekly' | 'monthly'
          start_date: string
          end_date: string | null
          next_delivery_date: string | null
          total_deliveries: number
          completed_deliveries: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_id?: string | null
          status?: 'active' | 'paused' | 'cancelled' | 'expired'
          frequency: 'daily' | 'weekly' | 'monthly'
          start_date: string
          end_date?: string | null
          next_delivery_date?: string | null
          total_deliveries?: number
          completed_deliveries?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_id?: string | null
          status?: 'active' | 'paused' | 'cancelled' | 'expired'
          frequency?: 'daily' | 'weekly' | 'monthly'
          start_date?: string
          end_date?: string | null
          next_delivery_date?: string | null
          total_deliveries?: number
          completed_deliveries?: number
          created_at?: string
          updated_at?: string
        }
      }
      subscription_items: {
        Row: {
          id: string
          subscription_id: string
          product_id: string | null
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          subscription_id: string
          product_id?: string | null
          quantity: number
          created_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string
          product_id?: string | null
          quantity?: number
          created_at?: string
        }
      }
      delivery_schedule: {
        Row: {
          id: string
          subscription_id: string | null
          order_id: string | null
          scheduled_date: string
          delivery_time_slot: string | null
          status: 'scheduled' | 'in_progress' | 'delivered' | 'cancelled' | 'skipped'
          actual_delivery_date: string | null
          delivery_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subscription_id?: string | null
          order_id?: string | null
          scheduled_date: string
          delivery_time_slot?: string | null
          status?: 'scheduled' | 'in_progress' | 'delivered' | 'cancelled' | 'skipped'
          actual_delivery_date?: string | null
          delivery_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string | null
          order_id?: string | null
          scheduled_date?: string
          delivery_time_slot?: string | null
          status?: 'scheduled' | 'in_progress' | 'delivered' | 'cancelled' | 'skipped'
          actual_delivery_date?: string | null
          delivery_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vacation_schedule: {
        Row: {
          id: string
          user_id: string
          start_date: string
          end_date: string
          reason: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start_date: string
          end_date: string
          reason?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          start_date?: string
          end_date?: string
          reason?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      wallet: {
        Row: {
          id: string
          user_id: string
          balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      wallet_transactions: {
        Row: {
          id: string
          wallet_id: string
          transaction_type: 'credit' | 'debit'
          amount: number
          balance_before: number
          balance_after: number
          description: string | null
          reference_type: 'order' | 'refund' | 'referral' | 'manual' | 'subscription' | null
          reference_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          wallet_id: string
          transaction_type: 'credit' | 'debit'
          amount: number
          balance_before: number
          balance_after: number
          description?: string | null
          reference_type?: 'order' | 'refund' | 'referral' | 'manual' | 'subscription' | null
          reference_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          wallet_id?: string
          transaction_type?: 'credit' | 'debit'
          amount?: number
          balance_before?: number
          balance_after?: number
          description?: string | null
          reference_type?: 'order' | 'refund' | 'referral' | 'manual' | 'subscription' | null
          reference_id?: string | null
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          order_id: string
          invoice_number: string
          invoice_date: string
          due_date: string | null
          subtotal: number
          tax_amount: number
          total_amount: number
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          pdf_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          invoice_number: string
          invoice_date: string
          due_date?: string | null
          subtotal: number
          tax_amount?: number
          total_amount: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          pdf_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          invoice_number?: string
          invoice_date?: string
          due_date?: string | null
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          pdf_url?: string | null
          created_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_email: string
          referred_name: string | null
          referral_code: string
          status: 'pending' | 'completed' | 'expired'
          reward_amount: number
          reward_status: 'pending' | 'credited' | 'expired'
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_email: string
          referred_name?: string | null
          referral_code: string
          status?: 'pending' | 'completed' | 'expired'
          reward_amount?: number
          reward_status?: 'pending' | 'credited' | 'expired'
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_email?: string
          referred_name?: string | null
          referral_code?: string
          status?: 'pending' | 'completed' | 'expired'
          reward_amount?: number
          reward_status?: 'pending' | 'credited' | 'expired'
          completed_at?: string | null
          created_at?: string
        }
      }
      support_requests: {
        Row: {
          id: string
          user_id: string
          subject: string
          message: string
          category: 'delivery' | 'payment' | 'product' | 'subscription' | 'technical' | 'other'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'open' | 'in_progress' | 'resolved' | 'closed'
          assigned_to: string | null
          resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject: string
          message: string
          category: 'delivery' | 'payment' | 'product' | 'subscription' | 'technical' | 'other'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          assigned_to?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          message?: string
          category?: 'delivery' | 'payment' | 'product' | 'subscription' | 'technical' | 'other'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          assigned_to?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      farm_visits: {
        Row: {
          id: string
          user_id: string
          visit_date: string
          preferred_time: string | null
          number_of_visitors: number
          purpose: string | null
          special_requirements: string | null
          status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          visit_date: string
          preferred_time?: string | null
          number_of_visitors?: number
          purpose?: string | null
          special_requirements?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          visit_date?: string
          preferred_time?: string | null
          number_of_visitors?: number
          purpose?: string | null
          special_requirements?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          featured_image_url: string | null
          author_id: string | null
          status: 'draft' | 'published' | 'archived'
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          featured_image_url?: string | null
          author_id?: string | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          featured_image_url?: string | null
          author_id?: string | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payment_logs: {
        Row: {
          id: string
          order_id: string
          payment_method: string
          transaction_id: string | null
          amount: number
          currency: string
          status: 'pending' | 'success' | 'failed' | 'refunded'
          gateway_response: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          payment_method: string
          transaction_id?: string | null
          amount: number
          currency?: string
          status: 'pending' | 'success' | 'failed' | 'refunded'
          gateway_response?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          payment_method?: string
          transaction_id?: string | null
          amount?: number
          currency?: string
          status?: 'pending' | 'success' | 'failed' | 'refunded'
          gateway_response?: Json | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Common types
export type UserProfile = Tables<'user_profiles'>
export type Product = Tables<'products'>
export type Order = Tables<'orders'>
export type Subscription = Tables<'subscriptions'>
export type CartItem = Tables<'user_cart'>
export type Wallet = Tables<'wallet'>
export type BlogPost = Tables<'blog_posts'> 