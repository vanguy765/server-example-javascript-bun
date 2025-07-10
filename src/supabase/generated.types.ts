// Generated from database schema
// Source: C:\Users\3900X\Code\vapiordie3\vapiordie3\src\supabase\schema.sql
// Generated on: 2025-06-08T21:29:14.882Z

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
      access_phones: {
        Row: {
          id: any | null
          tenant_id: any | null
          number: any | null
          description: string | null
          is_active: any | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          tenant_id?: any | null
          number?: any | null
          description?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          tenant_id?: any | null
          number?: any | null
          description?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
      }
      agents: {
        Row: {
          id: any | null
          tenant_id: any | null
          user_id: string | null
          name: any | null
          email: string | null
          phone_number: string | null
          department: string | null
          is_active: any | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          tenant_id?: any | null
          user_id?: string | null
          name?: any | null
          email?: string | null
          phone_number?: string | null
          department?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          tenant_id?: any | null
          user_id?: string | null
          name?: any | null
          email?: string | null
          phone_number?: string | null
          department?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
      }
      api_keys: {
        Row: {
          id: any | null
          tenant_id: any | null
          key: any | null
          name: any | null
          permissions: any | null
          expires_at: string | null
          is_active: any | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          tenant_id?: any | null
          key?: any | null
          name?: any | null
          permissions?: any | null
          expires_at?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          tenant_id?: any | null
          key?: any | null
          name?: any | null
          permissions?: any | null
          expires_at?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
      }
      audit_logs: {
        Row: {
          id: any | null
          table_name: any | null
          action: any | null
          old_data: Json | null
          new_data: Json | null
          changed_by: string | null
          changed_at: any | null
        }
        Insert: {
          id?: any | null
          table_name?: any | null
          action?: any | null
          old_data?: Json | null
          new_data?: Json | null
          changed_by?: string | null
          changed_at?: any | null
        }
        Update: {
          id?: any | null
          table_name?: any | null
          action?: any | null
          old_data?: Json | null
          new_data?: Json | null
          changed_by?: string | null
          changed_at?: any | null
        }
      }
      call_logs: {
        Row: {
          id: any | null
          tenant_id: any | null
          customer_id: string | null
          agent_id: string | null
          call_date: any | null
          duration: number | null
          notes: string | null
          follow_up_date: string | null
          reorder_id: string | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          tenant_id?: any | null
          customer_id?: string | null
          agent_id?: string | null
          call_date?: any | null
          duration?: number | null
          notes?: string | null
          follow_up_date?: string | null
          reorder_id?: string | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          tenant_id?: any | null
          customer_id?: string | null
          agent_id?: string | null
          call_date?: any | null
          duration?: number | null
          notes?: string | null
          follow_up_date?: string | null
          reorder_id?: string | null
          created_at?: any | null
          updated_at?: any | null
        }
      }
      customer_preferences: {
        Row: {
          id: any | null
          customer_id: any | null
          personal: any | null
          business: any | null
          orders: any | null
          created_at: any | null
          updated_at: any | null
          favorites: any | null
        }
        Insert: {
          id?: any | null
          customer_id?: any | null
          personal?: any | null
          business?: any | null
          orders?: any | null
          created_at?: any | null
          updated_at?: any | null
          favorites?: any | null
        }
        Update: {
          id?: any | null
          customer_id?: any | null
          personal?: any | null
          business?: any | null
          orders?: any | null
          created_at?: any | null
          updated_at?: any | null
          favorites?: any | null
        }
      }
      customers: {
        Row: {
          id: any | null
          tenant_id: any | null
          user_id: string | null // Reference to a user account when customer is also a user of the system
          first_name: any | null
          last_name: any | null
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          postal_code: string | null
          country: string | null
          industry_id: string | null
          company: string | null
          is_active: any | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          tenant_id?: any | null
          user_id?: string | null
          first_name?: any | null
          last_name?: any | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string | null
          industry_id?: string | null
          company?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          tenant_id?: any | null
          user_id?: string | null
          first_name?: any | null
          last_name?: any | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string | null
          industry_id?: string | null
          company?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
      }
      industries: {
        Row: {
          id: any | null
          name: any | null
          description: string | null
          is_active: any | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          name?: any | null
          description?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          name?: any | null
          description?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
      }
      ip_allowlist: {
        Row: {
          id: any | null
          tenant_id: any | null
          ip_address: any | null
          description: string | null
          is_active: any | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          tenant_id?: any | null
          ip_address?: any | null
          description?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          tenant_id?: any | null
          ip_address?: any | null
          description?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
      }
      messages: {
        Row: {
          id: any | null
          content: any | null
          user_id: any | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          content?: any | null
          user_id?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          content?: any | null
          user_id?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
      }
      order_items: {
        Row: {
          id: any | null
          tenant_id: any | null
          order_id: any | null
          product_id: string | null
          quantity: any | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          tenant_id?: any | null
          order_id?: any | null
          product_id?: string | null
          quantity?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          tenant_id?: any | null
          order_id?: any | null
          product_id?: string | null
          quantity?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
      }
      orders: {
        Row: {
          id: any | null
          tenant_id: any | null
          customer_id: string | null
          order_date: any | null
          status: any | null
          notes: string | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          tenant_id?: any | null
          customer_id?: string | null
          order_date?: any | null
          status?: any | null
          notes?: string | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          tenant_id?: any | null
          customer_id?: string | null
          order_date?: any | null
          status?: any | null
          notes?: string | null
          created_at?: any | null
          updated_at?: any | null
        }
      }
      product_categories: {
        Row: {
          id: any | null
          tenant_id: any | null
          name: any | null
          description: string | null
          is_active: any | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          tenant_id?: any | null
          name?: any | null
          description?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          tenant_id?: any | null
          name?: any | null
          description?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
      }
      product_specials: {
        Row: {
          id: any | null
          tenant_id: any | null
          product_id: any | null
          name: any | null
          start_date: string | null
          end_date: string | null
          is_active: any | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          tenant_id?: any | null
          product_id?: any | null
          name?: any | null
          start_date?: string | null
          end_date?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          tenant_id?: any | null
          product_id?: any | null
          name?: any | null
          start_date?: string | null
          end_date?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
      }
      products: {
        Row: {
          id: any | null
          tenant_id: any | null
          name: any | null
          description: string | null
          product_type_id: string | null
          category_id: string | null
          sku: string | null
          is_active: any | null
          created_at: any | null
          updated_at: any | null
          size: string | null
        }
        Insert: {
          id?: any | null
          tenant_id?: any | null
          name?: any | null
          description?: string | null
          product_type_id?: string | null
          category_id?: string | null
          sku?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
          size?: string | null
        }
        Update: {
          id?: any | null
          tenant_id?: any | null
          name?: any | null
          description?: string | null
          product_type_id?: string | null
          category_id?: string | null
          sku?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
          size?: string | null
        }
      }
      product_types: {
        Row: {
          id: any | null
          tenant_id: any | null
          category_id: string | null
          name: any | null
          description: string | null
          is_active: any | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          tenant_id?: any | null
          category_id?: string | null
          name?: any | null
          description?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          tenant_id?: any | null
          category_id?: string | null
          name?: any | null
          description?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
      }
      proposed_orders: {
        Row: {
          id: any | null // Primary identifier for the proposed order (UUID).
          tenant_id: any | null // The tenant this proposed order belongs to.
          customer_id: any | null // The customer for whom this order is being prepared.
          call_id: any | null // The call during which this order is being prepared, primary search key.
          proposed_date: any | null // The date this order is being proposed for.
          status: any // Current status of the proposed order (draft, presented, accepted, etc.).
          order_items: any // JSON array of order items, each containing productId, description, price, quantity, size, and base64 thumbnail.
          last_updated_by: string | null // The user who last updated this proposed order.
          last_device_id: string | null // Identifier of the device that last updated this order, for conflict resolution.
          created_at: any | null // Timestamp when the proposed order was created.
          updated_at: string | null // Timestamp when the proposed order was last updated.
        }
        Insert: {
          id?: any | null
          tenant_id?: any | null
          customer_id?: any | null
          call_id?: any | null
          proposed_date?: any | null
          status: any
          order_items: any
          last_updated_by?: string | null
          last_device_id?: string | null
          created_at?: any | null
          updated_at?: string | null
        }
        Update: {
          id?: any | null
          tenant_id?: any | null
          customer_id?: any | null
          call_id?: any | null
          proposed_date?: any | null
          status?: any
          order_items?: any
          last_updated_by?: string | null
          last_device_id?: string | null
          created_at?: any | null
          updated_at?: string | null
        }
      }
      proposed_orders_data: {
        Row: {
          id: any | null
          created_at: any | null
          call_id: any | null
          customer_id: any | null
          tenant_id: any | null
          data: Json | null
          data_type: string | null
          customer_phone: string | null
          sms_number: string | null
        }
        Insert: {
          id?: any | null
          created_at?: any | null
          call_id?: any | null
          customer_id?: any | null
          tenant_id?: any | null
          data?: Json | null
          data_type?: string | null
          customer_phone?: string | null
          sms_number?: string | null
        }
        Update: {
          id?: any | null
          created_at?: any | null
          call_id?: any | null
          customer_id?: any | null
          tenant_id?: any | null
          data?: Json | null
          data_type?: string | null
          customer_phone?: string | null
          sms_number?: string | null
        }
      }
      roles: {
        Row: {
          id: any | null
          name: any | null
          description: string | null
          permissions: any | null
          is_active: any | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          name?: any | null
          description?: string | null
          permissions?: any | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          name?: any | null
          description?: string | null
          permissions?: any | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
      }
      tenants: {
        Row: {
          id: any | null
          name: any | null
          domain: string | null
          settings: any | null
          is_active: any | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          name?: any | null
          domain?: string | null
          settings?: any | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          name?: any | null
          domain?: string | null
          settings?: any | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
      }
      user_preferences: {
        Row: {
          id: any | null
          user_id: any | null
          personal: any | null
          business: any | null
          orders: any | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          user_id?: any | null
          personal?: any | null
          business?: any | null
          orders?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          user_id?: any | null
          personal?: any | null
          business?: any | null
          orders?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
      }
      user_roles: {
        Row: {
          id: any | null
          user_id: any | null
          role_id: any | null
          tenant_id: any | null
          is_active: any | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          user_id?: any | null
          role_id?: any | null
          tenant_id?: any | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          user_id?: any | null
          role_id?: any | null
          tenant_id?: any | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
      }
      users: {
        Row: {
          id: any | null
          tenant_id: any | null
          email: any | null
          username: string | null
          password_hash: string | null
          last_login: string | null
          is_active: any | null
          created_at: any | null
          updated_at: any | null
        }
        Insert: {
          id?: any | null
          tenant_id?: any | null
          email?: any | null
          username?: string | null
          password_hash?: string | null
          last_login?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
        }
        Update: {
          id?: any | null
          tenant_id?: any | null
          email?: any | null
          username?: string | null
          password_hash?: string | null
          last_login?: string | null
          is_active?: any | null
          created_at?: any | null
          updated_at?: any | null
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
      call_outcome: 'success' | 'failed' | 'follow_up' | 'rescheduled' | 'no_answer' | 'busy' | 'callback_requested' | 'handoff' | 'timed_out'
      call_purpose: 'sales' | 'support' | 'feedback' | 'other' | 'complaint' | 'survey' | 'appointment' | 'billing'
      call_status: 'scheduled' | 'completed' | 'canceled' | 'in_progress' | 'missed' | 'rescheduled' | 'priority'
      contact_method: 'email' | 'phone' | 'sms' | 'mail' | 'chat' | 'in_person' | 'social_media' | 'none'
      interaction_outcome: 'successful' | 'unsuccessful' | 'pending' | 'scheduled' | 'cancelled' | 'follow_up' | 'no_answer' | 'busy' | 'callback_requested' | 'handoff' | 'timed_out' | 'ordered'
      interaction_purpose: 'sales' | 'support' | 'inquiry' | 'complaint' | 'feedback' | 'survey' | 'appointment' | 'billing' | 'other'
      interaction_status: 'scheduled' | 'completed' | 'canceled' | 'missed' | 'rescheduled' | 'in_progress' | 'priority'
      order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled' | 'returned' | 'refunded' | 'user_confirmed' | 'accepted'
    }
  }
}

// Type aliases for tables
export type AccessPhones = Database['public']['Tables']['access_phones']['Row']
export type AccessPhonesInsert = Database['public']['Tables']['access_phones']['Insert']
export type AccessPhonesUpdate = Database['public']['Tables']['access_phones']['Update']

export type Agents = Database['public']['Tables']['agents']['Row']
export type AgentsInsert = Database['public']['Tables']['agents']['Insert']
export type AgentsUpdate = Database['public']['Tables']['agents']['Update']

export type ApiKeys = Database['public']['Tables']['api_keys']['Row']
export type ApiKeysInsert = Database['public']['Tables']['api_keys']['Insert']
export type ApiKeysUpdate = Database['public']['Tables']['api_keys']['Update']

export type AuditLogs = Database['public']['Tables']['audit_logs']['Row']
export type AuditLogsInsert = Database['public']['Tables']['audit_logs']['Insert']
export type AuditLogsUpdate = Database['public']['Tables']['audit_logs']['Update']

export type CallLogs = Database['public']['Tables']['call_logs']['Row']
export type CallLogsInsert = Database['public']['Tables']['call_logs']['Insert']
export type CallLogsUpdate = Database['public']['Tables']['call_logs']['Update']

export type CustomerPreferences = Database['public']['Tables']['customer_preferences']['Row']
export type CustomerPreferencesInsert = Database['public']['Tables']['customer_preferences']['Insert']
export type CustomerPreferencesUpdate = Database['public']['Tables']['customer_preferences']['Update']

export type Customers = Database['public']['Tables']['customers']['Row']
export type CustomersInsert = Database['public']['Tables']['customers']['Insert']
export type CustomersUpdate = Database['public']['Tables']['customers']['Update']

export type Industries = Database['public']['Tables']['industries']['Row']
export type IndustriesInsert = Database['public']['Tables']['industries']['Insert']
export type IndustriesUpdate = Database['public']['Tables']['industries']['Update']

export type IpAllowlist = Database['public']['Tables']['ip_allowlist']['Row']
export type IpAllowlistInsert = Database['public']['Tables']['ip_allowlist']['Insert']
export type IpAllowlistUpdate = Database['public']['Tables']['ip_allowlist']['Update']

export type Messages = Database['public']['Tables']['messages']['Row']
export type MessagesInsert = Database['public']['Tables']['messages']['Insert']
export type MessagesUpdate = Database['public']['Tables']['messages']['Update']

export type OrderItems = Database['public']['Tables']['order_items']['Row']
export type OrderItemsInsert = Database['public']['Tables']['order_items']['Insert']
export type OrderItemsUpdate = Database['public']['Tables']['order_items']['Update']

export type Orders = Database['public']['Tables']['orders']['Row']
export type OrdersInsert = Database['public']['Tables']['orders']['Insert']
export type OrdersUpdate = Database['public']['Tables']['orders']['Update']

export type ProductCategories = Database['public']['Tables']['product_categories']['Row']
export type ProductCategoriesInsert = Database['public']['Tables']['product_categories']['Insert']
export type ProductCategoriesUpdate = Database['public']['Tables']['product_categories']['Update']

export type ProductSpecials = Database['public']['Tables']['product_specials']['Row']
export type ProductSpecialsInsert = Database['public']['Tables']['product_specials']['Insert']
export type ProductSpecialsUpdate = Database['public']['Tables']['product_specials']['Update']

export type Products = Database['public']['Tables']['products']['Row']
export type ProductsInsert = Database['public']['Tables']['products']['Insert']
export type ProductsUpdate = Database['public']['Tables']['products']['Update']

export type ProductTypes = Database['public']['Tables']['product_types']['Row']
export type ProductTypesInsert = Database['public']['Tables']['product_types']['Insert']
export type ProductTypesUpdate = Database['public']['Tables']['product_types']['Update']

export type ProposedOrders = Database['public']['Tables']['proposed_orders']['Row']
export type ProposedOrdersInsert = Database['public']['Tables']['proposed_orders']['Insert']
export type ProposedOrdersUpdate = Database['public']['Tables']['proposed_orders']['Update']

export type ProposedOrdersData = Database['public']['Tables']['proposed_orders_data']['Row']
export type ProposedOrdersDataInsert = Database['public']['Tables']['proposed_orders_data']['Insert']
export type ProposedOrdersDataUpdate = Database['public']['Tables']['proposed_orders_data']['Update']

export type Roles = Database['public']['Tables']['roles']['Row']
export type RolesInsert = Database['public']['Tables']['roles']['Insert']
export type RolesUpdate = Database['public']['Tables']['roles']['Update']

export type Tenants = Database['public']['Tables']['tenants']['Row']
export type TenantsInsert = Database['public']['Tables']['tenants']['Insert']
export type TenantsUpdate = Database['public']['Tables']['tenants']['Update']

export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
export type UserPreferencesInsert = Database['public']['Tables']['user_preferences']['Insert']
export type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update']

export type UserRoles = Database['public']['Tables']['user_roles']['Row']
export type UserRolesInsert = Database['public']['Tables']['user_roles']['Insert']
export type UserRolesUpdate = Database['public']['Tables']['user_roles']['Update']

export type Users = Database['public']['Tables']['users']['Row']
export type UsersInsert = Database['public']['Tables']['users']['Insert']
export type UsersUpdate = Database['public']['Tables']['users']['Update']

