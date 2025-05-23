# Using MCP Server for Supabase Schema Introspection

This document describes an alternative approach to generating TypeScript types, Zod schemas, and enum types from a Supabase database schema using a Model Context Protocol (MCP) server.

## Problem Recap

The traditional API-based approach fails because it attempts to access PostgreSQL system tables (like `information_schema.tables`), which are restricted by Supabase for security reasons. We previously attempted to use the Supabase CLI, but encountered issues with parsing the CLI output format and extracting the project reference ID.

## The MCP Server Approach

The Model Context Protocol (MCP) server approach provides a more robust solution by:

1. Creating a local API server that accesses your Supabase database using the same credentials
2. Using custom SQL functions (deployed to your database) to safely query schema information
3. Exposing endpoints that can be used by code generation tools
4. Handling errors and providing detailed information

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- Supabase CLI installed (`npm install -g supabase`)
- Supabase project with admin access

### Setup Steps

1. **Deploy SQL Functions**

   First, deploy the required SQL functions to your Supabase project:

   ```bash
   npx supabase db push --file ./scripts/schema-functions.sql
   ```

2. **Run the Setup Script**

   Run the setup script to install dependencies and prepare the environment:

   ```bash
   npx tsx ./scripts/setup-mcp-server.ts
   ```

3. **Start the MCP Server**

   Start the MCP server:

   ```bash
   npx tsx ./scripts/mcp-schema-server.ts
   ```

4. **Access Schema Information**

   Once the server is running, you can access your database schema through these endpoints:

   - `GET /schema/tables` - List all tables
   - `GET /schema/columns/:tableName` - Get columns for a table
   - `GET /schema/primary-keys/:tableName` - Get primary keys for a table
   - `GET /schema/foreign-keys/:tableName` - Get foreign keys for a table
   - `GET /schema/indexes/:tableName` - Get indexes for a table
   - `GET /schema/enums` - Get all enum types
   - `GET /schema/complete` - Get complete database schema

## Using with Type Generation

You can use the MCP server to generate types by:

1. Start the MCP server
2. Run a script that fetches data from the MCP server and generates files
3. Use the generated files in your application

Example code to generate types:

```typescript
// Example code for generating types using the MCP server
async function generateTypes() {
  // Fetch complete schema from MCP server
  const response = await fetch("http://localhost:3100/schema/complete");
  const schema = await response.json();

  // Generate types file
  let typesContent = `// Auto-generated TypeScript types from Supabase schema
// Generated on: ${new Date().toISOString()}

export type Database = {
  public: {
    Tables: {
`;

  // Add table types
  for (const [tableName, tableInfo] of Object.entries(schema.tables)) {
    typesContent += `      ${tableName}: {\n`;
    typesContent += `        Row: {\n`;

    for (const column of tableInfo.columns) {
      typesContent += `          ${column.column_name}: ${mapPostgresToTs(column)};\n`;
    }

    typesContent += `        };\n`;
    // Add Insert and Update types...
    typesContent += `      };\n`;
  }

  typesContent += `    };\n`;
  typesContent += `  };\n`;
  typesContent += `};\n`;

  // Write the file
  fs.writeFileSync("./src/supabase/generated.types.ts", typesContent);
}

// Map PostgreSQL types to TypeScript types
function mapPostgresToTs(column) {
  // Implementation goes here...
}
```

## Benefits of the MCP Server Approach

1. **Error Resilience**: The server handles errors gracefully and provides meaningful error messages
2. **Flexibility**: You can extend the server with additional endpoints as needed
3. **Control**: You have full control over the type generation process
4. **Reusability**: The server can be used for multiple projects

## Troubleshooting

- **Access Denied Errors**: Make sure you have deployed the SQL functions and have the proper permissions
- **Missing Tables**: Some system tables might be excluded by default; check your Supabase settings
- **Connection Issues**: Verify your Supabase credentials in the configuration file

## Next Steps

- Add authentication to the MCP server for better security
- Implement automatic file generation based on the schema
- Add validation for generated files
- Create a UI for visualizing the schema
