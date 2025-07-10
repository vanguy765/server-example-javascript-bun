// Generated Zod schemas from database
// Source: C:\Users\3900X\Code\vapiordie3\vapiordie3\src\supabase\schema.sql
// Generated on: 2025-06-08T21:29:14.885Z

import { z } from 'zod';
import { Json } from './generated.types';

export const AccessPhonesSchema = z.object({
  id: z.any().nullish(),
  tenant_id: z.any().nullish(),
  number: z.any().nullish(),
  description: z.string().nullish(),
  is_active: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const AccessPhonesInsertSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  number: z.any().nullish().optional(),
  description: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const AccessPhonesUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  number: z.any().nullish().optional(),
  description: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

export const AgentsSchema = z.object({
  id: z.any().nullish(),
  tenant_id: z.any().nullish(),
  user_id: z.string().nullish(),
  name: z.any().nullish(),
  email: z.string().nullish(),
  phone_number: z.string().nullish(),
  department: z.string().nullish(),
  is_active: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const AgentsInsertSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  user_id: z.string().nullish().optional(),
  name: z.any().nullish().optional(),
  email: z.string().nullish().optional(),
  phone_number: z.string().nullish().optional(),
  department: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const AgentsUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  user_id: z.string().nullish().optional(),
  name: z.any().nullish().optional(),
  email: z.string().nullish().optional(),
  phone_number: z.string().nullish().optional(),
  department: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

export const ApiKeysSchema = z.object({
  id: z.any().nullish(),
  tenant_id: z.any().nullish(),
  key: z.any().nullish(),
  name: z.any().nullish(),
  permissions: z.any().nullish(),
  expires_at: z.string().nullish(),
  is_active: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const ApiKeysInsertSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  key: z.any().nullish().optional(),
  name: z.any().nullish().optional(),
  permissions: z.any().nullish().optional(),
  expires_at: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const ApiKeysUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  key: z.any().nullish().optional(),
  name: z.any().nullish().optional(),
  permissions: z.any().nullish().optional(),
  expires_at: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

export const AuditLogsSchema = z.object({
  id: z.any().nullish(),
  table_name: z.any().nullish(),
  action: z.any().nullish(),
  old_data: z.custom<Json>((val) => true).nullish(),
  new_data: z.custom<Json>((val) => true).nullish(),
  changed_by: z.string().nullish(),
  changed_at: z.any().nullish(),
});

export const AuditLogsInsertSchema = z.object({
  id: z.any().nullish().optional(),
  table_name: z.any().nullish().optional(),
  action: z.any().nullish().optional(),
  old_data: z.custom<Json>((val) => true).nullish().optional(),
  new_data: z.custom<Json>((val) => true).nullish().optional(),
  changed_by: z.string().nullish().optional(),
  changed_at: z.any().nullish().optional(),
});

export const AuditLogsUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  table_name: z.any().nullish().optional(),
  action: z.any().nullish().optional(),
  old_data: z.custom<Json>((val) => true).nullish().optional(),
  new_data: z.custom<Json>((val) => true).nullish().optional(),
  changed_by: z.string().nullish().optional(),
  changed_at: z.any().nullish().optional(),
}).partial();

export const CallLogsSchema = z.object({
  id: z.any().nullish(),
  tenant_id: z.any().nullish(),
  customer_id: z.string().nullish(),
  agent_id: z.string().nullish(),
  call_date: z.any().nullish(),
  duration: z.number().nullish(),
  notes: z.string().nullish(),
  follow_up_date: z.string().nullish(),
  reorder_id: z.string().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const CallLogsInsertSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  customer_id: z.string().nullish().optional(),
  agent_id: z.string().nullish().optional(),
  call_date: z.any().nullish().optional(),
  duration: z.number().nullish().optional(),
  notes: z.string().nullish().optional(),
  follow_up_date: z.string().nullish().optional(),
  reorder_id: z.string().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const CallLogsUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  customer_id: z.string().nullish().optional(),
  agent_id: z.string().nullish().optional(),
  call_date: z.any().nullish().optional(),
  duration: z.number().nullish().optional(),
  notes: z.string().nullish().optional(),
  follow_up_date: z.string().nullish().optional(),
  reorder_id: z.string().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

export const CustomerPreferencesSchema = z.object({
  id: z.any().nullish(),
  customer_id: z.any().nullish(),
  personal: z.any().nullish(),
  business: z.any().nullish(),
  orders: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
  favorites: z.any().nullish(),
});

export const CustomerPreferencesInsertSchema = z.object({
  id: z.any().nullish().optional(),
  customer_id: z.any().nullish().optional(),
  personal: z.any().nullish().optional(),
  business: z.any().nullish().optional(),
  orders: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
  favorites: z.any().nullish().optional(),
});

export const CustomerPreferencesUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  customer_id: z.any().nullish().optional(),
  personal: z.any().nullish().optional(),
  business: z.any().nullish().optional(),
  orders: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
  favorites: z.any().nullish().optional(),
}).partial();

export const CustomersSchema = z.object({
  id: z.any().nullish(),
  tenant_id: z.any().nullish(),
  user_id: z.string().nullish(), // Reference to a user account when customer is also a user of the system
  first_name: z.any().nullish(),
  last_name: z.any().nullish(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  address: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  postal_code: z.string().nullish(),
  country: z.string().nullish(),
  industry_id: z.string().nullish(),
  company: z.string().nullish(),
  is_active: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const CustomersInsertSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  user_id: z.string().nullish().optional(),
  first_name: z.any().nullish().optional(),
  last_name: z.any().nullish().optional(),
  email: z.string().nullish().optional(),
  phone: z.string().nullish().optional(),
  address: z.string().nullish().optional(),
  city: z.string().nullish().optional(),
  state: z.string().nullish().optional(),
  postal_code: z.string().nullish().optional(),
  country: z.string().nullish().optional(),
  industry_id: z.string().nullish().optional(),
  company: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const CustomersUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  user_id: z.string().nullish().optional(),
  first_name: z.any().nullish().optional(),
  last_name: z.any().nullish().optional(),
  email: z.string().nullish().optional(),
  phone: z.string().nullish().optional(),
  address: z.string().nullish().optional(),
  city: z.string().nullish().optional(),
  state: z.string().nullish().optional(),
  postal_code: z.string().nullish().optional(),
  country: z.string().nullish().optional(),
  industry_id: z.string().nullish().optional(),
  company: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

export const IndustriesSchema = z.object({
  id: z.any().nullish(),
  name: z.any().nullish(),
  description: z.string().nullish(),
  is_active: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const IndustriesInsertSchema = z.object({
  id: z.any().nullish().optional(),
  name: z.any().nullish().optional(),
  description: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const IndustriesUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  name: z.any().nullish().optional(),
  description: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

export const IpAllowlistSchema = z.object({
  id: z.any().nullish(),
  tenant_id: z.any().nullish(),
  ip_address: z.any().nullish(),
  description: z.string().nullish(),
  is_active: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const IpAllowlistInsertSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  ip_address: z.any().nullish().optional(),
  description: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const IpAllowlistUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  ip_address: z.any().nullish().optional(),
  description: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

export const MessagesSchema = z.object({
  id: z.any().nullish(),
  content: z.any().nullish(),
  user_id: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const MessagesInsertSchema = z.object({
  id: z.any().nullish().optional(),
  content: z.any().nullish().optional(),
  user_id: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const MessagesUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  content: z.any().nullish().optional(),
  user_id: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

export const OrderItemsSchema = z.object({
  id: z.any().nullish(),
  tenant_id: z.any().nullish(),
  order_id: z.any().nullish(),
  product_id: z.string().nullish(),
  quantity: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const OrderItemsInsertSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  order_id: z.any().nullish().optional(),
  product_id: z.string().nullish().optional(),
  quantity: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const OrderItemsUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  order_id: z.any().nullish().optional(),
  product_id: z.string().nullish().optional(),
  quantity: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

export const OrdersSchema = z.object({
  id: z.any().nullish(),
  tenant_id: z.any().nullish(),
  customer_id: z.string().nullish(),
  order_date: z.any().nullish(),
  status: z.any().nullish(),
  notes: z.string().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const OrdersInsertSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  customer_id: z.string().nullish().optional(),
  order_date: z.any().nullish().optional(),
  status: z.any().nullish().optional(),
  notes: z.string().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const OrdersUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  customer_id: z.string().nullish().optional(),
  order_date: z.any().nullish().optional(),
  status: z.any().nullish().optional(),
  notes: z.string().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

export const ProductCategoriesSchema = z.object({
  id: z.any().nullish(),
  tenant_id: z.any().nullish(),
  name: z.any().nullish(),
  description: z.string().nullish(),
  is_active: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const ProductCategoriesInsertSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  name: z.any().nullish().optional(),
  description: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const ProductCategoriesUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  name: z.any().nullish().optional(),
  description: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

export const ProductSpecialsSchema = z.object({
  id: z.any().nullish(),
  tenant_id: z.any().nullish(),
  product_id: z.any().nullish(),
  name: z.any().nullish(),
  start_date: z.string().nullish(),
  end_date: z.string().nullish(),
  is_active: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const ProductSpecialsInsertSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  product_id: z.any().nullish().optional(),
  name: z.any().nullish().optional(),
  start_date: z.string().nullish().optional(),
  end_date: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const ProductSpecialsUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  product_id: z.any().nullish().optional(),
  name: z.any().nullish().optional(),
  start_date: z.string().nullish().optional(),
  end_date: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

export const ProductsSchema = z.object({
  id: z.any().nullish(),
  tenant_id: z.any().nullish(),
  name: z.any().nullish(),
  description: z.string().nullish(),
  product_type_id: z.string().nullish(),
  category_id: z.string().nullish(),
  sku: z.string().nullish(),
  is_active: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
  size: z.string().nullish(),
});

export const ProductsInsertSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  name: z.any().nullish().optional(),
  description: z.string().nullish().optional(),
  product_type_id: z.string().nullish().optional(),
  category_id: z.string().nullish().optional(),
  sku: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
  size: z.string().nullish().optional(),
});

export const ProductsUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  name: z.any().nullish().optional(),
  description: z.string().nullish().optional(),
  product_type_id: z.string().nullish().optional(),
  category_id: z.string().nullish().optional(),
  sku: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
  size: z.string().nullish().optional(),
}).partial();

export const ProductTypesSchema = z.object({
  id: z.any().nullish(),
  tenant_id: z.any().nullish(),
  category_id: z.string().nullish(),
  name: z.any().nullish(),
  description: z.string().nullish(),
  is_active: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const ProductTypesInsertSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  category_id: z.string().nullish().optional(),
  name: z.any().nullish().optional(),
  description: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const ProductTypesUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  category_id: z.string().nullish().optional(),
  name: z.any().nullish().optional(),
  description: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

export const ProposedOrdersSchema = z.object({
  id: z.any().nullish(), // Primary identifier for the proposed order (UUID).
  tenant_id: z.any().nullish(), // The tenant this proposed order belongs to.
  customer_id: z.any().nullish(), // The customer for whom this order is being prepared.
  call_id: z.any().nullish(), // The call during which this order is being prepared, primary search key.
  proposed_date: z.any().nullish(), // The date this order is being proposed for.
  status: z.any(), // Current status of the proposed order (draft, presented, accepted, etc.).
  order_items: z.any(), // JSON array of order items, each containing productId, description, price, quantity, size, and base64 thumbnail.
  last_updated_by: z.string().nullish(), // The user who last updated this proposed order.
  last_device_id: z.string().nullish(), // Identifier of the device that last updated this order, for conflict resolution.
  created_at: z.any().nullish(), // Timestamp when the proposed order was created.
  updated_at: z.string().nullish(), // Timestamp when the proposed order was last updated.
});

export const ProposedOrdersInsertSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  customer_id: z.any().nullish().optional(),
  call_id: z.any().nullish().optional(),
  proposed_date: z.any().nullish().optional(),
  status: z.any(),
  order_items: z.any(),
  last_updated_by: z.string().nullish().optional(),
  last_device_id: z.string().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.string().nullish().optional(),
});

export const ProposedOrdersUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  customer_id: z.any().nullish().optional(),
  call_id: z.any().nullish().optional(),
  proposed_date: z.any().nullish().optional(),
  status: z.any().optional(),
  order_items: z.any().optional(),
  last_updated_by: z.string().nullish().optional(),
  last_device_id: z.string().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.string().nullish().optional(),
}).partial();

export const ProposedOrdersDataSchema = z.object({
  id: z.any().nullish(),
  created_at: z.any().nullish(),
  call_id: z.any().nullish(),
  customer_id: z.any().nullish(),
  tenant_id: z.any().nullish(),
  data: z.custom<Json>((val) => true).nullish(),
  data_type: z.string().nullish(),
  customer_phone: z.string().nullish(),
  sms_number: z.string().nullish(),
});

export const ProposedOrdersDataInsertSchema = z.object({
  id: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  call_id: z.any().nullish().optional(),
  customer_id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  data: z.custom<Json>((val) => true).nullish().optional(),
  data_type: z.string().nullish().optional(),
  customer_phone: z.string().nullish().optional(),
  sms_number: z.string().nullish().optional(),
});

export const ProposedOrdersDataUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  call_id: z.any().nullish().optional(),
  customer_id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  data: z.custom<Json>((val) => true).nullish().optional(),
  data_type: z.string().nullish().optional(),
  customer_phone: z.string().nullish().optional(),
  sms_number: z.string().nullish().optional(),
}).partial();

export const RolesSchema = z.object({
  id: z.any().nullish(),
  name: z.any().nullish(),
  description: z.string().nullish(),
  permissions: z.any().nullish(),
  is_active: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const RolesInsertSchema = z.object({
  id: z.any().nullish().optional(),
  name: z.any().nullish().optional(),
  description: z.string().nullish().optional(),
  permissions: z.any().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const RolesUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  name: z.any().nullish().optional(),
  description: z.string().nullish().optional(),
  permissions: z.any().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

export const TenantsSchema = z.object({
  id: z.any().nullish(),
  name: z.any().nullish(),
  domain: z.string().nullish(),
  settings: z.any().nullish(),
  is_active: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const TenantsInsertSchema = z.object({
  id: z.any().nullish().optional(),
  name: z.any().nullish().optional(),
  domain: z.string().nullish().optional(),
  settings: z.any().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const TenantsUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  name: z.any().nullish().optional(),
  domain: z.string().nullish().optional(),
  settings: z.any().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

export const UserPreferencesSchema = z.object({
  id: z.any().nullish(),
  user_id: z.any().nullish(),
  personal: z.any().nullish(),
  business: z.any().nullish(),
  orders: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const UserPreferencesInsertSchema = z.object({
  id: z.any().nullish().optional(),
  user_id: z.any().nullish().optional(),
  personal: z.any().nullish().optional(),
  business: z.any().nullish().optional(),
  orders: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const UserPreferencesUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  user_id: z.any().nullish().optional(),
  personal: z.any().nullish().optional(),
  business: z.any().nullish().optional(),
  orders: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

export const UserRolesSchema = z.object({
  id: z.any().nullish(),
  user_id: z.any().nullish(),
  role_id: z.any().nullish(),
  tenant_id: z.any().nullish(),
  is_active: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const UserRolesInsertSchema = z.object({
  id: z.any().nullish().optional(),
  user_id: z.any().nullish().optional(),
  role_id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const UserRolesUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  user_id: z.any().nullish().optional(),
  role_id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

export const UsersSchema = z.object({
  id: z.any().nullish(),
  tenant_id: z.any().nullish(),
  email: z.any().nullish(),
  username: z.string().nullish(),
  password_hash: z.string().nullish(),
  last_login: z.string().nullish(),
  is_active: z.any().nullish(),
  created_at: z.any().nullish(),
  updated_at: z.any().nullish(),
});

export const UsersInsertSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  email: z.any().nullish().optional(),
  username: z.string().nullish().optional(),
  password_hash: z.string().nullish().optional(),
  last_login: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
});

export const UsersUpdateSchema = z.object({
  id: z.any().nullish().optional(),
  tenant_id: z.any().nullish().optional(),
  email: z.any().nullish().optional(),
  username: z.string().nullish().optional(),
  password_hash: z.string().nullish().optional(),
  last_login: z.string().nullish().optional(),
  is_active: z.any().nullish().optional(),
  created_at: z.any().nullish().optional(),
  updated_at: z.any().nullish().optional(),
}).partial();

