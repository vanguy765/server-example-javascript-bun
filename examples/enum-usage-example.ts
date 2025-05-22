/**
 * Example demonstrating how to use the auto-generated enum types
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// This would normally be imported from the generated file:
// import { UserRole, userRoleSchema, getEnumValues } from "../src/supabase/generated.enums";

// For demonstration purposes, we'll create a simple enum similar to what would be generated
enum UserRole {
  Admin = "admin",
  Editor = "editor",
  Viewer = "viewer",
}

// Load environment variables
dotenv.config();

async function demonstrateEnumsUsage() {
  console.log("🚀 Demonstrating enum usage from generated types");

  try {
    // Get Supabase credentials from environment
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Missing Supabase credentials in environment variables");
      return;
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Example 1: Using enum values for type safety
    console.log("\n📝 Example 1: Type-safe enum usage");

    function checkUserPermission(role: UserRole): boolean {
      return role === UserRole.Admin || role === UserRole.Editor;
    }

    console.log(`Admin has permission: ${checkUserPermission(UserRole.Admin)}`);
    console.log(
      `Viewer has permission: ${checkUserPermission(UserRole.Viewer)}`
    );

    // Example 2: Converting string values to enums
    console.log("\n📝 Example 2: Converting strings to enums");

    function getRoleFromString(roleStr: string): UserRole | null {
      const roles = Object.values(UserRole);
      if (roles.includes(roleStr as UserRole)) {
        return roleStr as UserRole;
      }
      return null;
    }

    console.log(`"admin" as enum: ${getRoleFromString("admin")}`);
    console.log(`"unknown" as enum: ${getRoleFromString("unknown")}`);

    // Example 3: Using in database queries
    console.log("\n📝 Example 3: Using in database queries");

    // This is an example query, it will only work if you have a users table with a role column
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", UserRole.Admin)
      .limit(5);

    if (error) {
      console.log(`Query error: ${error.message}`);
    } else {
      console.log(`Found ${data?.length || 0} users with Admin role`);
      console.log(data);
    }

    console.log("\n✅ Enum usage demonstration complete");
    console.log(
      "Note: Once you've run the schema introspection script, you'll have strongly-typed enums in src/supabase/generated.enums.ts"
    );
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

demonstrateEnumsUsage();
