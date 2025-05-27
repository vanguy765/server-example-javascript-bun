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
      access_phones: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          number: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          number: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          number?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_phones_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          created_at: string | null
          department: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone_number: string | null
          tenant_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone_number?: string | null
          tenant_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone_number?: string | null
          tenant_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key: string
          name: string
          permissions: Json | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key: string
          name: string
          permissions?: Json | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key?: string
          name?: string
          permissions?: Json | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          changed_at: string | null
          changed_by: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          table_name: string
        }
        Insert: {
          action: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          table_name: string
        }
        Update: {
          action?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          table_name?: string
        }
        Relationships: []
      }
      call_logs: {
        Row: {
          agent_id: string | null
          call_date: string | null
          created_at: string | null
          customer_id: string | null
          duration: number | null
          follow_up_date: string | null
          id: string
          notes: string | null
          outcome: Database["public"]["Enums"]["interaction_outcome"] | null
          purpose: Database["public"]["Enums"]["interaction_purpose"] | null
          reorder_id: string | null
          status: Database["public"]["Enums"]["interaction_status"] | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          call_date?: string | null
          created_at?: string | null
          customer_id?: string | null
          duration?: number | null
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          outcome?: Database["public"]["Enums"]["interaction_outcome"] | null
          purpose?: Database["public"]["Enums"]["interaction_purpose"] | null
          reorder_id?: string | null
          status?: Database["public"]["Enums"]["interaction_status"] | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          call_date?: string | null
          created_at?: string | null
          customer_id?: string | null
          duration?: number | null
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          outcome?: Database["public"]["Enums"]["interaction_outcome"] | null
          purpose?: Database["public"]["Enums"]["interaction_purpose"] | null
          reorder_id?: string | null
          status?: Database["public"]["Enums"]["interaction_status"] | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_call_logs_reorder"
            columns: ["reorder_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_preferences: {
        Row: {
          business: Json | null
          contact_by_enum: Database["public"]["Enums"]["contact_method"] | null
          created_at: string | null
          customer_id: string
          favorites: Json | null
          id: string
          orders: Json | null
          personal: Json | null
          updated_at: string | null
        }
        Insert: {
          business?: Json | null
          contact_by_enum?: Database["public"]["Enums"]["contact_method"] | null
          created_at?: string | null
          customer_id: string
          favorites?: Json | null
          id?: string
          orders?: Json | null
          personal?: Json | null
          updated_at?: string | null
        }
        Update: {
          business?: Json | null
          contact_by_enum?: Database["public"]["Enums"]["contact_method"] | null
          created_at?: string | null
          customer_id?: string
          favorites?: Json | null
          id?: string
          orders?: Json | null
          personal?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          industry_id: string | null
          is_active: boolean | null
          last_name: string
          phone: string | null
          postal_code: string | null
          state: string | null
          tenant_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          industry_id?: string | null
          is_active?: boolean | null
          last_name: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          tenant_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          industry_id?: string | null
          is_active?: boolean | null
          last_name?: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          tenant_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      industries: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ip_allowlist: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          ip_address: unknown
          is_active: boolean | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address: unknown
          is_active?: boolean | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ip_allowlist_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          discount: number | null
          id: string
          order_id: string
          price: number
          product_id: string | null
          quantity: number
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          discount?: number | null
          id?: string
          order_id: string
          price: number
          product_id?: string | null
          quantity: number
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          discount?: number | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string | null
          quantity?: number
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          notes: string | null
          order_date: string | null
          status: string
          tenant_id: string
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          status: string
          tenant_id: string
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          status?: string
          tenant_id?: string
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_specials: {
        Row: {
          created_at: string | null
          discount: number | null
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          product_id: string
          start_date: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          discount?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          product_id: string
          start_date?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          discount?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          product_id?: string
          start_date?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_specials_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_specials_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_types: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_types_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_types_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number | null
          product_type_id: string | null
          size: string | null
          sku: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price?: number | null
          product_type_id?: string | null
          size?: string | null
          sku?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number | null
          product_type_id?: string | null
          size?: string | null
          sku?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_product_type_id_fkey"
            columns: ["product_type_id"]
            isOneToOne: false
            referencedRelation: "product_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      proposed_orders: {
        Row: {
          call_id: string
          created_at: string
          customer_id: string
          id: string
          last_device_id: string | null
          last_updated_by: string | null
          order_items: Json
          proposed_date: string
          status: string
          tenant_id: string
          total: number
          updated_at: string | null
        }
        Insert: {
          call_id: string
          created_at?: string
          customer_id: string
          id?: string
          last_device_id?: string | null
          last_updated_by?: string | null
          order_items?: Json
          proposed_date?: string
          status?: string
          tenant_id: string
          total?: number
          updated_at?: string | null
        }
        Update: {
          call_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          last_device_id?: string | null
          last_updated_by?: string | null
          order_items?: Json
          proposed_date?: string
          status?: string
          tenant_id?: string
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_proposed_orders_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_proposed_orders_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          permissions: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          permissions?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          permissions?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tenants: {
        Row: {
          created_at: string | null
          domain: string | null
          id: string
          is_active: boolean | null
          name: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          business: Json | null
          contact_by_enum: Database["public"]["Enums"]["contact_method"] | null
          created_at: string | null
          id: string
          orders: Json | null
          personal: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business?: Json | null
          contact_by_enum?: Database["public"]["Enums"]["contact_method"] | null
          created_at?: string | null
          id?: string
          orders?: Json | null
          personal?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business?: Json | null
          contact_by_enum?: Database["public"]["Enums"]["contact_method"] | null
          created_at?: string | null
          id?: string
          orders?: Json | null
          personal?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          role_id: string
          tenant_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          role_id: string
          tenant_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          role_id?: string
          tenant_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login: string | null
          password_hash: string | null
          tenant_id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          password_hash?: string | null
          tenant_id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          password_hash?: string | null
          tenant_id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      
// Add the missing view/table definition
"product_specials_view": {
  Row: {
    id: string;
    product_id: string;
    product_name: string;
    product_description: string;
    product_price: number;
    product_size: string;
    discount: number;
    end_date: string;
    tenant_id: string;
  };
  Insert: {
    // If this is a view, Insert/Update may be empty or omitted
  };
  Update: {
    // If this is a view, Insert/Update may be empty or omitted
  };
}
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      citext: {
        Args: { "": boolean } | { "": string } | { "": unknown }
        Returns: string
      }
      citext_hash: {
        Args: { "": string }
        Returns: number
      }
      citextin: {
        Args: { "": unknown }
        Returns: string
      }
      citextout: {
        Args: { "": string }
        Returns: unknown
      }
      citextrecv: {
        Args: { "": unknown }
        Returns: string
      }
      citextsend: {
        Args: { "": string }
        Returns: string
      }
      commit_proposed_order: {
        Args: { call_id_input: string }
        Returns: undefined
      }
      get_current_product_specials: {
        Args: { tenant_id_input?: string }
        Returns: Json
      }
      get_customer_by_id: {
        Args: { customer_id_input: string }
        Returns: Json
      }
      get_customer_favorites: {
        Args: { customer_id: string }
        Returns: {
          product_id: string
          product_name: string
          product_description: string
          price: number
          size: string
          tenant_id: string
          created_at: string
          updated_at: string
        }[]
      }
      get_details_for_products_in_customer_pref: {
        Args: { customer_id_input: string }
        Returns: Json
      }
      get_last_order: {
        Args: { customer_id_input: string }
        Returns: Json
      }
      get_product_specials_by_tenant: {
        Args: { tenant_id_input: string }
        Returns: Json
      }
      get_proposed_order: {
        Args: { call_id: string }
        Returns: Json
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      has_role: {
        Args: { user_id: string; role_name: string; tenant_id: string }
        Returns: boolean
      }
      insert_proposed_order: {
        Args: { order_data: Json }
        Returns: undefined
      }
      reset_config: {
        Args: { setting_name: string }
        Returns: undefined
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      set_tenant_context: {
        Args: { tenant_id: string }
        Returns: undefined
      }
      set_user_context: {
        Args: { user_id: string }
        Returns: undefined
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      update_proposed_order: {
        Args: { call_id_input: string; order_data: Json }
        Returns: undefined
      }
    }
    Enums: {
      call_outcome:
        | "success"
        | "failed"
        | "follow_up"
        | "rescheduled"
        | "no_answer"
        | "busy"
        | "callback_requested"
        | "handoff"
        | "timed_out"
      call_purpose:
        | "sales"
        | "support"
        | "feedback"
        | "other"
        | "complaint"
        | "survey"
        | "appointment"
        | "billing"
      call_status:
        | "scheduled"
        | "completed"
        | "canceled"
        | "in_progress"
        | "missed"
        | "rescheduled"
        | "priority"
      contact_method:
        | "email"
        | "phone"
        | "sms"
        | "mail"
        | "chat"
        | "in_person"
        | "social_media"
        | "none"
      interaction_outcome:
        | "successful"
        | "unsuccessful"
        | "pending"
        | "scheduled"
        | "cancelled"
        | "follow_up"
        | "no_answer"
        | "busy"
        | "callback_requested"
        | "handoff"
        | "timed_out"
        | "ordered"
      interaction_purpose:
        | "sales"
        | "support"
        | "inquiry"
        | "complaint"
        | "feedback"
        | "survey"
        | "appointment"
        | "billing"
        | "other"
      interaction_status:
        | "scheduled"
        | "completed"
        | "canceled"
        | "missed"
        | "rescheduled"
        | "in_progress"
        | "priority"
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "canceled"
        | "returned"
        | "refunded"
        | "user_confirmed"
        | "accepted"
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
  public: {
    Enums: {
      call_outcome: [
        "success",
        "failed",
        "follow_up",
        "rescheduled",
        "no_answer",
        "busy",
        "callback_requested",
        "handoff",
        "timed_out",
      ],
      call_purpose: [
        "sales",
        "support",
        "feedback",
        "other",
        "complaint",
        "survey",
        "appointment",
        "billing",
      ],
      call_status: [
        "scheduled",
        "completed",
        "canceled",
        "in_progress",
        "missed",
        "rescheduled",
        "priority",
      ],
      contact_method: [
        "email",
        "phone",
        "sms",
        "mail",
        "chat",
        "in_person",
        "social_media",
        "none",
      ],
      interaction_outcome: [
        "successful",
        "unsuccessful",
        "pending",
        "scheduled",
        "cancelled",
        "follow_up",
        "no_answer",
        "busy",
        "callback_requested",
        "handoff",
        "timed_out",
        "ordered",
      ],
      interaction_purpose: [
        "sales",
        "support",
        "inquiry",
        "complaint",
        "feedback",
        "survey",
        "appointment",
        "billing",
        "other",
      ],
      interaction_status: [
        "scheduled",
        "completed",
        "canceled",
        "missed",
        "rescheduled",
        "in_progress",
        "priority",
      ],
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "canceled",
        "returned",
        "refunded",
        "user_confirmed",
        "accepted",
      ],
    },
  },
} as const
