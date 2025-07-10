# Database Schema Analysis

*Auto-generated on 6/8/2025, 2:29:14 PM*

## Database Relationships

```mermaid
erDiagram
    access_phones {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        uuid NOT NULL tenant_id
        text NOT NULL number
        text description
        boolean DEFAULT true is_active
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
    agents {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        uuid NOT NULL tenant_id
        uuid user_id
        text NOT NULL name
        text email
        text phone_number
        text department
        boolean DEFAULT true is_active
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
    api_keys {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        uuid NOT NULL tenant_id
        text NOT NULL key
        text NOT NULL name
        jsonb DEFAULT permissions
        timestamp with time zone expires_at
        boolean DEFAULT true is_active
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
    audit_logs {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        text NOT NULL table_name
        text NOT NULL action
        jsonb old_data
        jsonb new_data
        uuid changed_by
        timestamp with time zone DEFAULT now() changed_at
    }
    call_logs {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        uuid NOT NULL tenant_id
        uuid customer_id
        uuid agent_id
        timestamp with time zone DEFAULT now() call_date
        integer duration
        text notes
        timestamp with time zone follow_up_date
        uuid reorder_id
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
    customer_preferences {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        uuid NOT NULL customer_id
        jsonb DEFAULT personal
        jsonb DEFAULT business
        jsonb DEFAULT orders
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
        jsonb DEFAULT favorites
    }
    customers {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        uuid NOT NULL tenant_id
        uuid user_id
        text NOT NULL first_name
        text NOT NULL last_name
        text email
        text phone
        text address
        text city
        text state
        text postal_code
        text country
        uuid industry_id
        text company
        boolean DEFAULT true is_active
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
    industries {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        text NOT NULL name
        text description
        boolean DEFAULT true is_active
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
    ip_allowlist {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        uuid NOT NULL tenant_id
        cidr NOT NULL ip_address
        text description
        boolean DEFAULT true is_active
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
    messages {
        integer NOT NULL id
        text NOT NULL content
        text NOT NULL user_id
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
    order_items {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        uuid NOT NULL tenant_id
        uuid NOT NULL order_id
        uuid product_id
        integer NOT NULL quantity
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
    orders {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        uuid NOT NULL tenant_id
        uuid customer_id
        timestamp with time zone DEFAULT now() order_date
        text NOT NULL status
        text notes
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
    product_categories {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        uuid NOT NULL tenant_id
        text NOT NULL name
        text description
        boolean DEFAULT true is_active
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
    product_specials {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        uuid NOT NULL tenant_id
        uuid NOT NULL product_id
        text NOT NULL name
        timestamp with time zone start_date
        timestamp with time zone end_date
        boolean DEFAULT true is_active
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
    products {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        uuid NOT NULL tenant_id
        text NOT NULL name
        text description
        uuid product_type_id
        uuid category_id
        text sku
        boolean DEFAULT true is_active
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
        character varying size
    }
    product_types {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        uuid NOT NULL tenant_id
        uuid category_id
        text NOT NULL name
        text description
        boolean DEFAULT true is_active
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
    proposed_orders {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        uuid NOT NULL tenant_id
        uuid NOT NULL customer_id
        uuid NOT NULL call_id
        timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL proposed_date
        text DEFAULT status NOT NULL
        jsonb DEFAULT order_items NOT NULL
        uuid last_updated_by
        text last_device_id
        timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL created_at
        timestamp with time zone updated_at
    }
    proposed_orders_data {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        timestamp with time zone DEFAULT now() NOT NULL created_at
        uuid DEFAULT gen_random_uuid() NOT NULL call_id
        uuid DEFAULT gen_random_uuid() NOT NULL customer_id
        uuid DEFAULT gen_random_uuid() NOT NULL tenant_id
        jsonb data
        text data_type
        text customer_phone
        text sms_number
    }
    roles {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        text NOT NULL name
        text description
        jsonb DEFAULT permissions
        boolean DEFAULT true is_active
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
    tenants {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        text NOT NULL name
        text domain
        jsonb DEFAULT settings
        boolean DEFAULT true is_active
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
    user_preferences {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        uuid NOT NULL user_id
        jsonb DEFAULT personal
        jsonb DEFAULT business
        jsonb DEFAULT orders
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
    user_roles {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        uuid NOT NULL user_id
        uuid NOT NULL role_id
        uuid NOT NULL tenant_id
        boolean DEFAULT true is_active
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
    users {
        uuid DEFAULT gen_random_uuid() NOT NULL id
        uuid NOT NULL tenant_id
        text NOT NULL email
        text username
        text password_hash
        timestamp with time zone last_login
        boolean DEFAULT true is_active
        timestamp with time zone DEFAULT now() created_at
        timestamp with time zone DEFAULT now() updated_at
    }
```

## Database Tables

### access_phones

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| tenant_id | uuid NOT NULL | ✅ | ❌ |  |  |
| number | text NOT NULL | ✅ | ❌ |  |  |
| description | text | ✅ | ❌ |  |  |
| is_active | boolean DEFAULT true | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### agents

Customer service agents who handle calls and orders

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| tenant_id | uuid NOT NULL | ✅ | ❌ |  |  |
| user_id | uuid | ✅ | ❌ |  |  |
| name | text NOT NULL | ✅ | ❌ |  |  |
| email | text | ✅ | ❌ |  |  |
| phone_number | text | ✅ | ❌ |  |  |
| department | text | ✅ | ❌ |  |  |
| is_active | boolean DEFAULT true | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### api_keys

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| tenant_id | uuid NOT NULL | ✅ | ❌ |  |  |
| key | text NOT NULL | ✅ | ❌ |  |  |
| name | text NOT NULL | ✅ | ❌ |  |  |
| permissions | jsonb DEFAULT | ✅ | ❌ |  |  |
| expires_at | timestamp with time zone | ✅ | ❌ |  |  |
| is_active | boolean DEFAULT true | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### audit_logs

System-wide audit trail for tracking changes

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| table_name | text NOT NULL | ✅ | ❌ |  |  |
| action | text NOT NULL | ✅ | ❌ |  |  |
| old_data | jsonb | ✅ | ❌ |  |  |
| new_data | jsonb | ✅ | ❌ |  |  |
| changed_by | uuid | ✅ | ❌ |  |  |
| changed_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### call_logs

Records of customer interactions via phone

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| tenant_id | uuid NOT NULL | ✅ | ❌ |  |  |
| customer_id | uuid | ✅ | ❌ |  |  |
| agent_id | uuid | ✅ | ❌ |  |  |
| call_date | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| duration | integer | ✅ | ❌ |  |  |
| notes | text | ✅ | ❌ |  |  |
| follow_up_date | timestamp with time zone | ✅ | ❌ |  |  |
| reorder_id | uuid | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### customer_preferences

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| customer_id | uuid NOT NULL | ✅ | ❌ |  |  |
| personal | jsonb DEFAULT | ✅ | ❌ |  |  |
| business | jsonb DEFAULT | ✅ | ❌ |  |  |
| orders | jsonb DEFAULT | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| favorites | jsonb DEFAULT | ✅ | ❌ |  |  |

### customers

Customer information across all tenants

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| tenant_id | uuid NOT NULL | ✅ | ❌ |  |  |
| user_id | uuid | ✅ | ❌ |  | Reference to a user account when customer is also a user of the system |
| first_name | text NOT NULL | ✅ | ❌ |  |  |
| last_name | text NOT NULL | ✅ | ❌ |  |  |
| email | text | ✅ | ❌ |  |  |
| phone | text | ✅ | ❌ |  |  |
| address | text | ✅ | ❌ |  |  |
| city | text | ✅ | ❌ |  |  |
| state | text | ✅ | ❌ |  |  |
| postal_code | text | ✅ | ❌ |  |  |
| country | text | ✅ | ❌ |  |  |
| industry_id | uuid | ✅ | ❌ |  |  |
| company | text | ✅ | ❌ |  |  |
| is_active | boolean DEFAULT true | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### industries

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| name | text NOT NULL | ✅ | ❌ |  |  |
| description | text | ✅ | ❌ |  |  |
| is_active | boolean DEFAULT true | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### ip_allowlist

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| tenant_id | uuid NOT NULL | ✅ | ❌ |  |  |
| ip_address | cidr NOT NULL | ✅ | ❌ |  |  |
| description | text | ✅ | ❌ |  |  |
| is_active | boolean DEFAULT true | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### messages

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | integer NOT NULL | ✅ | ❌ |  |  |
| content | text NOT NULL | ✅ | ❌ |  |  |
| user_id | text NOT NULL | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### order_items

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| tenant_id | uuid NOT NULL | ✅ | ❌ |  |  |
| order_id | uuid NOT NULL | ✅ | ❌ |  |  |
| product_id | uuid | ✅ | ❌ |  |  |
| quantity | integer NOT NULL | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### orders

Customer orders placed across the system

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| tenant_id | uuid NOT NULL | ✅ | ❌ |  |  |
| customer_id | uuid | ✅ | ❌ |  |  |
| order_date | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| status | text NOT NULL | ✅ | ❌ |  |  |
| notes | text | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### product_categories

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| tenant_id | uuid NOT NULL | ✅ | ❌ |  |  |
| name | text NOT NULL | ✅ | ❌ |  |  |
| description | text | ✅ | ❌ |  |  |
| is_active | boolean DEFAULT true | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### product_specials

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| tenant_id | uuid NOT NULL | ✅ | ❌ |  |  |
| product_id | uuid NOT NULL | ✅ | ❌ |  |  |
| name | text NOT NULL | ✅ | ❌ |  |  |
| start_date | timestamp with time zone | ✅ | ❌ |  |  |
| end_date | timestamp with time zone | ✅ | ❌ |  |  |
| is_active | boolean DEFAULT true | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### products

Products available for ordering

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| tenant_id | uuid NOT NULL | ✅ | ❌ |  |  |
| name | text NOT NULL | ✅ | ❌ |  |  |
| description | text | ✅ | ❌ |  |  |
| product_type_id | uuid | ✅ | ❌ |  |  |
| category_id | uuid | ✅ | ❌ |  |  |
| sku | text | ✅ | ❌ |  |  |
| is_active | boolean DEFAULT true | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| size | character varying | ✅ | ❌ |  |  |

### product_types

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| tenant_id | uuid NOT NULL | ✅ | ❌ |  |  |
| category_id | uuid | ✅ | ❌ |  |  |
| name | text NOT NULL | ✅ | ❌ |  |  |
| description | text | ✅ | ❌ |  |  |
| is_active | boolean DEFAULT true | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### proposed_orders

Temporary storage for draft orders being prepared during customer calls. Acts as a coordination point between different devices.

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  | Primary identifier for the proposed order (UUID). |
| tenant_id | uuid NOT NULL | ✅ | ❌ |  | The tenant this proposed order belongs to. |
| customer_id | uuid NOT NULL | ✅ | ❌ |  | The customer for whom this order is being prepared. |
| call_id | uuid NOT NULL | ✅ | ❌ |  | The call during which this order is being prepared, primary search key. |
| proposed_date | timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL | ✅ | ❌ |  | The date this order is being proposed for. |
| status | text DEFAULT | ❌ | ❌ |  | Current status of the proposed order (draft, presented, accepted, etc.). |
| order_items | jsonb DEFAULT | ❌ | ❌ |  | JSON array of order items, each containing productId, description, price, quantity, size, and base64 thumbnail. |
| last_updated_by | uuid | ✅ | ❌ |  | The user who last updated this proposed order. |
| last_device_id | text | ✅ | ❌ |  | Identifier of the device that last updated this order, for conflict resolution. |
| created_at | timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL | ✅ | ❌ |  | Timestamp when the proposed order was created. |
| updated_at | timestamp with time zone | ✅ | ❌ |  | Timestamp when the proposed order was last updated. |

### proposed_orders_data

Standin for Redis, temporarily holds order, specials and favorites data

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() NOT NULL | ✅ | ❌ |  |  |
| call_id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| customer_id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| tenant_id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| data | jsonb | ✅ | ❌ |  |  |
| data_type | text | ✅ | ❌ |  |  |
| customer_phone | text | ✅ | ❌ |  |  |
| sms_number | text | ✅ | ❌ |  |  |

### roles

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| name | text NOT NULL | ✅ | ❌ |  |  |
| description | text | ✅ | ❌ |  |  |
| permissions | jsonb DEFAULT | ✅ | ❌ |  |  |
| is_active | boolean DEFAULT true | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### tenants

Contains tenant/organization information for multi-tenant setup

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| name | text NOT NULL | ✅ | ❌ |  |  |
| domain | text | ✅ | ❌ |  |  |
| settings | jsonb DEFAULT | ✅ | ❌ |  |  |
| is_active | boolean DEFAULT true | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### user_preferences

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| user_id | uuid NOT NULL | ✅ | ❌ |  |  |
| personal | jsonb DEFAULT | ✅ | ❌ |  |  |
| business | jsonb DEFAULT | ✅ | ❌ |  |  |
| orders | jsonb DEFAULT | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### user_roles

Role assignments for users across tenants

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| user_id | uuid NOT NULL | ✅ | ❌ |  |  |
| role_id | uuid NOT NULL | ✅ | ❌ |  |  |
| tenant_id | uuid NOT NULL | ✅ | ❌ |  |  |
| is_active | boolean DEFAULT true | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

### users

User authentication and identification information across tenants

| Column | Type | Nullable | Primary Key | Default | Description |
| ------ | ---- | -------- | ----------- | ------- | ----------- |
| id | uuid DEFAULT gen_random_uuid() NOT NULL | ✅ | ❌ |  |  |
| tenant_id | uuid NOT NULL | ✅ | ❌ |  |  |
| email | text NOT NULL | ✅ | ❌ |  |  |
| username | text | ✅ | ❌ |  |  |
| password_hash | text | ✅ | ❌ |  |  |
| last_login | timestamp with time zone | ✅ | ❌ |  |  |
| is_active | boolean DEFAULT true | ✅ | ❌ |  |  |
| created_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |
| updated_at | timestamp with time zone DEFAULT now() | ✅ | ❌ |  |  |

## Database Enums

### call_outcome

| Value |
| ----- |
| success |
| failed |
| follow_up |
| rescheduled |
| no_answer |
| busy |
| callback_requested |
| handoff |
| timed_out |

### call_purpose

| Value |
| ----- |
| sales |
| support |
| feedback |
| other |
| complaint |
| survey |
| appointment |
| billing |

### call_status

| Value |
| ----- |
| scheduled |
| completed |
| canceled |
| in_progress |
| missed |
| rescheduled |
| priority |

### contact_method

| Value |
| ----- |
| email |
| phone |
| sms |
| mail |
| chat |
| in_person |
| social_media |
| none |

### interaction_outcome

| Value |
| ----- |
| successful |
| unsuccessful |
| pending |
| scheduled |
| cancelled |
| follow_up |
| no_answer |
| busy |
| callback_requested |
| handoff |
| timed_out |
| ordered |

### interaction_purpose

| Value |
| ----- |
| sales |
| support |
| inquiry |
| complaint |
| feedback |
| survey |
| appointment |
| billing |
| other |

### interaction_status

| Value |
| ----- |
| scheduled |
| completed |
| canceled |
| missed |
| rescheduled |
| in_progress |
| priority |

### order_status

| Value |
| ----- |
| pending |
| processing |
| shipped |
| delivered |
| canceled |
| returned |
| refunded |
| user_confirmed |
| accepted |

## Using Generated Types

### TypeScript Types

The generated TypeScript types can be imported from `src/supabase/generated.types.ts`:

```typescript
import { Database, User, UserInsert, UserUpdate } from '../supabase/generated.types';

// Use in Supabase client initialization
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Use table types directly
function processUser(user: User) {
  console.log(user.name);
}

// Use for strongly-typed inserts
const newUser: UserInsert = {
  name: 'John Doe',
  email: 'john@example.com'
};
```

### Zod Schemas

The generated Zod schemas can be imported from `src/supabase/generated.schemas.ts`:

```typescript
import { UserSchema, UserInsertSchema } from '../supabase/generated.schemas';

// Validate user data
const userData = { /* ... */ };
const validationResult = UserSchema.safeParse(userData);

if (validationResult.success) {
  // Data is valid and fully typed
  const user = validationResult.data;
} else {
  // Handle validation errors
  console.error(validationResult.error);
}

// Use for form validation
function validateForm(formData: unknown) {
  return UserInsertSchema.safeParse(formData);
}
```

### Repository Pattern

The generated repository helpers can be imported from `src/supabase/generated-repo.ts`:

```typescript
import { createUserRepository } from '../supabase/generated-repo';
import { supabase } from '../path/to/your/supabase-client';

// Create repository for a specific table
const userRepo = createUserRepository(supabase);

// Use repository methods
async function example() {
  // Get all users
  const allUsers = await userRepo.getAll();
  
  // Get user by ID
  const user = await userRepo.getById('user-id');
  
  // Create a new user
  const newUser = await userRepo.create({
    name: 'John Doe',
    email: 'john@example.com'
  });
  
  // Update a user
  const updatedUser = await userRepo.update('user-id', {
    name: 'Jane Doe'
  });
  
  // Delete a user
  await userRepo.delete('user-id');
  
  // Custom query
  const customResult = await userRepo.query()
    .select('id, name')
    .eq('role', 'admin')
    .limit(10);
}
```
