import fs from "fs";
import path from "path";
import {
  parseSchemaFile,
  Table,
  TableColumn,
  ParsedSchema,
} from "./enhanced-schema-parser";

// Paths
const SCHEMA_SQL_PATH = path.join(__dirname, "../src/supabase/schema.sql");
const SCHEMA_ANALYSIS_PATH = path.join(
  __dirname,
  "../docs/auto-generated-types.md"
);

/**
 * Generate relationship graph between tables
 */
function generateRelationshipGraph(schema: ParsedSchema): string {
  const { tables } = schema;
  const publicTables = tables.filter((t) => t.schema === "public");

  let output = "## Database Relationships\n\n";
  output += "```mermaid\nerDiagram\n";

  // Add all tables
  for (const table of publicTables) {
    output += `    ${table.name} {\n`;

    for (const column of table.columns) {
      const type = column.type.replace(/\[\]$/, "[]"); // Normalize array notation
      const pk = column.isPrimaryKey ? " PK" : "";
      const fk = column.foreignKey ? " FK" : "";
      const nullable = column.isNullable ? "" : " NOT NULL";

      output += `        ${type} ${column.name}${pk}${fk}${nullable}\n`;
    }

    output += "    }\n";
  }

  // Add relationships
  for (const table of publicTables) {
    for (const column of table.columns) {
      if (column.foreignKey) {
        const targetTable = column.foreignKey.table;
        const targetColumn = column.foreignKey.column;
        const relationshipType = column.isNullable ? "||--o{" : "||--|{";

        output += `    ${targetTable} ${relationshipType} ${table.name} : "${targetColumn} -> ${column.name}"\n`;
      }
    }
  }

  output += "```\n\n";
  return output;
}

/**
 * Generate detailed table documentation
 */
function generateTableDocumentation(schema: ParsedSchema): string {
  const { tables, enums } = schema;
  const publicTables = tables.filter((t) => t.schema === "public");

  let output = "## Database Tables\n\n";

  for (const table of publicTables) {
    output += `### ${table.name}\n\n`;

    if (table.description) {
      output += `${table.description}\n\n`;
    }

    output +=
      "| Column | Type | Nullable | Primary Key | Default | Description |\n";
    output +=
      "| ------ | ---- | -------- | ----------- | ------- | ----------- |\n";

    for (const column of table.columns) {
      const nullable = column.isNullable ? "✅" : "❌";
      const primaryKey = column.isPrimaryKey ? "✅" : "❌";
      const defaultValue = column.defaultValue || "";
      const description = column.description || "";

      // Add foreign key information to description if applicable
      let columnDescription = description;
      if (column.foreignKey) {
        columnDescription += columnDescription ? "<br>" : "";
        columnDescription += `References \`${column.foreignKey.table}\`.\`${column.foreignKey.column}\``;
      }

      output += `| ${column.name} | ${column.type} | ${nullable} | ${primaryKey} | ${defaultValue} | ${columnDescription} |\n`;
    }

    output += "\n";
  }

  // Add enum documentation if there are any
  if (enums.length > 0) {
    output += "## Database Enums\n\n";

    for (const enumDef of enums.filter((e) => e.schema === "public")) {
      output += `### ${enumDef.name}\n\n`;

      output += "| Value |\n";
      output += "| ----- |\n";

      for (const value of enumDef.values) {
        output += `| ${value} |\n`;
      }

      output += "\n";
    }
  }

  return output;
}

/**
 * Generate documentation about TypeScript and Zod schema usage
 */
function generateUsageDocumentation(): string {
  return `## Using Generated Types

### TypeScript Types

The generated TypeScript types can be imported from \`src/supabase/generated.types.ts\`:

\`\`\`typescript
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
\`\`\`

### Zod Schemas

The generated Zod schemas can be imported from \`src/supabase/generated.schemas.ts\`:

\`\`\`typescript
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
\`\`\`

### Repository Pattern

The generated repository helpers can be imported from \`src/supabase/generated-repo.ts\`:

\`\`\`typescript
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
\`\`\`
`;
}

async function analyzeSchema() {
  try {
    console.log("=== Analyzing Database Schema ===");

    // Parse the schema
    console.log(`\nParsing schema from: ${SCHEMA_SQL_PATH}`);
    const schema = parseSchemaFile(SCHEMA_SQL_PATH);

    console.log(
      `Found ${schema.tables.length} tables and ${schema.enums.length} enums`
    );

    // Generate the analysis document
    console.log(`Generating schema analysis document...`);

    let output = `# Database Schema Analysis\n\n`;
    output += `*Auto-generated on ${new Date().toLocaleString()}*\n\n`;

    // Add relationship graph
    output += generateRelationshipGraph(schema);

    // Add detailed table documentation
    output += generateTableDocumentation(schema);

    // Add usage documentation
    output += generateUsageDocumentation();

    // Write to file
    fs.writeFileSync(SCHEMA_ANALYSIS_PATH, output);
    console.log(`✅ Schema analysis written to: ${SCHEMA_ANALYSIS_PATH}`);
  } catch (error) {
    console.error("Error analyzing schema:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  analyzeSchema();
}

export { analyzeSchema };
