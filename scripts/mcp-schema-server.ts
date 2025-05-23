import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseCredentials } from "../src/config/supabase.config";

/**
 * MCP Server for Supabase Schema Introspection
 *
 * This server implements a Model Context Protocol (MCP) server
 * to query your Supabase database schema metadata and
 * expose it as an API that can be used to generate TypeScript types,
 * Zod schemas, and other code artifacts.
 */

// Initialize Supabase client
const { url, key } = getSupabaseCredentials();
const supabase = createClient(url, key);

// Create Hono app
const app = new Hono();

// MCP Server health check endpoint
app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "Supabase Schema Introspection MCP Server",
    endpoints: [
      "/schema/tables",
      "/schema/columns/:tableName",
      "/schema/primary-keys/:tableName",
      "/schema/foreign-keys/:tableName",
      "/schema/indexes/:tableName",
      "/schema/enums",
    ],
  });
});

// Get all tables
app.get("/schema/tables", async (c) => {
  try {
    // Try a direct query to pg_tables which is usually accessible
    const { data, error } = await supabase
      .from("pg_tables")
      .select("tablename")
      .eq("schemaname", "public")
      .not("tablename", "like", "pg_%"); // Exclude PostgreSQL system tables

    if (error) {
      throw new Error(`Error fetching tables: ${error.message}`);
    }

    const tables = data.map((table: { tablename: string }) => table.tablename);
    return c.json({ tables });
  } catch (error) {
    console.error("Failed to query pg_tables directly, trying raw SQL...");

    // Last resort - try an RPC call if defined in your database
    try {
      // Using a raw SQL query if available as RPC
      const { data, error: sqlError } = await supabase
        .rpc("select_tables", { schema_name: "public" })
        .select("*");

      if (sqlError || !data) {
        throw new Error(`SQL query failed: ${(sqlError as Error)?.message}`);
      }

      return c.json({ tables: data });
    } catch (sqlError) {
      console.error("All table query methods failed");
      return c.json(
        {
          error: "Failed to retrieve tables",
          message: (sqlError as Error)?.message || "Unknown error",
          tables: [],
        },
        500
      );
    }
  }
});

// Get columns for a specific table
app.get("/schema/columns/:tableName", async (c) => {
  const tableName = c.req.param("tableName");

  try {
    const { data, error } = await supabase
      .from("information_schema.columns")
      .select(
        `
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale
      `
      )
      .eq("table_schema", "public")
      .eq("table_name", tableName)
      .order("ordinal_position");

    if (error) {
      throw new Error(
        `Error fetching columns for ${tableName}: ${error.message}`
      );
    }

    return c.json({ columns: data });
  } catch (error) {
    return c.json(
      {
        error: `Failed to retrieve columns for table ${tableName}`,
        message: (error as Error)?.message || "Unknown error",
        columns: [],
      },
      500
    );
  }
});

// Get primary keys for a specific table
app.get("/schema/primary-keys/:tableName", async (c) => {
  const tableName = c.req.param("tableName");

  try {
    const { data, error } = await supabase
      .from("information_schema.key_column_usage")
      .select("column_name")
      .eq("table_schema", "public")
      .eq("table_name", tableName)
      .eq("constraint_name", `${tableName}_pkey`);

    if (error) {
      throw new Error(
        `Error fetching primary keys for ${tableName}: ${error.message}`
      );
    }

    const primaryKeys = data.map(
      (row: { column_name: string }) => row.column_name
    );
    return c.json({ primaryKeys });
  } catch (error) {
    return c.json(
      {
        error: `Failed to retrieve primary keys for table ${tableName}`,
        message: (error as Error)?.message || "Unknown error",
        primaryKeys: [],
      },
      500
    );
  }
});

// Get foreign keys for a specific table
app.get("/schema/foreign-keys/:tableName", async (c) => {
  const tableName = c.req.param("tableName");

  try {
    // Using raw SQL via RPC since this information is harder to get through the REST API
    const { data, error } = await supabase
      .rpc("get_foreign_keys", { table_name: tableName })
      .select("*");

    if (error) {
      throw new Error(
        `Error fetching foreign keys for ${tableName}: ${error.message}`
      );
    }

    return c.json({ foreignKeys: data || [] });
  } catch (error) {
    return c.json(
      {
        error: `Failed to retrieve foreign keys for table ${tableName}`,
        message: (error as Error)?.message || "Unknown error",
        foreignKeys: [],
      },
      500
    );
  }
});

// Get indexes for a specific table
app.get("/schema/indexes/:tableName", async (c) => {
  const tableName = c.req.param("tableName");

  try {
    // Using raw SQL via RPC since this information is harder to get through the REST API
    const { data, error } = await supabase
      .rpc("get_indexes", { table_name: tableName })
      .select("*");

    if (error) {
      throw new Error(
        `Error fetching indexes for ${tableName}: ${error.message}`
      );
    }

    return c.json({ indexes: data || [] });
  } catch (error) {
    return c.json(
      {
        error: `Failed to retrieve indexes for table ${tableName}`,
        message: (error as Error)?.message || "Unknown error",
        indexes: [],
      },
      500
    );
  }
});

// Get enum types
app.get("/schema/enums", async (c) => {
  try {
    const { data, error } = await supabase
      .from("pg_type")
      .select(
        `
        typname,
        pg_enum.enumlabel
      `
      )
      .eq("typtype", "e") // Enum types only
      .join("pg_enum", "pg_type.oid", "pg_enum.enumtypid")
      .order("pg_enum.enumsortorder");

    if (error) {
      throw new Error(`Error fetching enum types: ${error.message}`);
    }

    // Process the data to group by enum type name
    const enumTypes: Record<string, string[]> = {};

    data.forEach((row: { typname: string; enumlabel: string }) => {
      if (!enumTypes[row.typname]) {
        enumTypes[row.typname] = [];
      }
      enumTypes[row.typname].push(row.enumlabel);
    });

    return c.json({ enumTypes });
  } catch (error) {
    return c.json(
      {
        error: "Failed to retrieve enum types",
        message: (error as Error)?.message || "Unknown error",
        enumTypes: {},
      },
      500
    );
  }
});

// Get complete database schema
app.get("/schema/complete", async (c) => {
  try {
    // Get tables
    const tablesResponse = await fetch(
      `${c.req.url.split("/schema")[0]}/schema/tables`
    );
    const tablesData = await tablesResponse.json();

    // Create schema object
    const schema: any = {
      tables: {},
      enums: {},
    };

    // Get table details
    for (const tableName of tablesData.tables) {
      // Get columns
      const columnsResponse = await fetch(
        `${c.req.url.split("/schema")[0]}/schema/columns/${tableName}`
      );
      const columnsData = await columnsResponse.json();

      // Get primary keys
      const primaryKeysResponse = await fetch(
        `${c.req.url.split("/schema")[0]}/schema/primary-keys/${tableName}`
      );
      const primaryKeysData = await primaryKeysResponse.json();

      schema.tables[tableName] = {
        columns: columnsData.columns,
        primaryKeys: primaryKeysData.primaryKeys,
      };

      // Try to get foreign keys if available
      try {
        const foreignKeysResponse = await fetch(
          `${c.req.url.split("/schema")[0]}/schema/foreign-keys/${tableName}`
        );
        const foreignKeysData = await foreignKeysResponse.json();
        schema.tables[tableName].foreignKeys = foreignKeysData.foreignKeys;
      } catch (error) {
        schema.tables[tableName].foreignKeys = [];
      }
    }

    // Get enum types
    const enumsResponse = await fetch(
      `${c.req.url.split("/schema")[0]}/schema/enums`
    );
    const enumsData = await enumsResponse.json();
    schema.enums = enumsData.enumTypes;

    return c.json(schema);
  } catch (error) {
    return c.json(
      {
        error: "Failed to retrieve complete schema",
        message: (error as Error)?.message || "Unknown error",
      },
      500
    );
  }
});

// Start the server
const port = Number(process.env.PORT) || 3100;
serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(
      `🚀 Supabase Schema MCP Server started on http://localhost:${info.port}`
    );
    console.log("Available endpoints:");
    console.log("- GET /schema/tables: List all tables");
    console.log("- GET /schema/columns/:tableName: Get columns for a table");
    console.log(
      "- GET /schema/primary-keys/:tableName: Get primary keys for a table"
    );
    console.log(
      "- GET /schema/foreign-keys/:tableName: Get foreign keys for a table"
    );
    console.log("- GET /schema/indexes/:tableName: Get indexes for a table");
    console.log("- GET /schema/enums: Get all enum types");
    console.log("- GET /schema/complete: Get complete database schema");
  }
);
