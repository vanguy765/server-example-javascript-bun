/**
 * Database table types for TypeScript
 * These types define the structure of database tables
 */

export interface Tenant {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  description?: string;
  status?: string;
  contact_email?: string;
  contact_phone?: string;
  // Add additional fields as needed
}

// You can add more table types here as your application grows
// For example:
/*
export interface User {
  id: string;
  email: string;
  tenant_id: string;
  created_at?: string;
  // etc.
}
*/

// Export a dummy value to ensure this is treated as a module
const types = {};
export default types;
