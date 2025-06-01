import fs from "fs";
import path from "path";

// Types for representing database schema
export interface TableColumn {
  name: string;
  type: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
  defaultValue: string | null;
  description: string | null;
  foreignKey: {
    table: string;
    column: string;
  } | null;
}

export interface TableConstraint {
  name: string;
  type: "PRIMARY KEY" | "FOREIGN KEY" | "UNIQUE" | "CHECK";
  columns: string[];
  referencedTable?: string;
  referencedColumns?: string[];
}

export interface Table {
  schema: string;
  name: string;
  columns: TableColumn[];
  constraints: TableConstraint[];
  description: string | null;
}

export interface ParsedSchema {
  tables: Table[];
  enums: {
    name: string;
    values: string[];
    schema: string;
  }[];
}

// RegExp patterns for parsing schema
const CREATE_TABLE_PATTERN =
  /CREATE TABLE (?:IF NOT EXISTS )?((?:[a-zA-Z0-9_"]+)\.)?([a-zA-Z0-9_"]+)[\s]*\(([\s\S]+?)\);/g;
const CREATE_ENUM_PATTERN =
  /CREATE TYPE ([a-zA-Z0-9_"]+)\.?([a-zA-Z0-9_"]+) AS ENUM \(([^)]+)\);/g;
const COMMENT_ON_PATTERN =
  /COMMENT ON (?:TABLE|COLUMN) ([a-zA-Z0-9_."]+)(?: IS | IS)?\s*'([^']+)';/g;

/**
 * Parse PostgreSQL schema.sql file to extract table and enum definitions
 */
export function parseSchemaFile(schemaPath: string): ParsedSchema {
  console.log(`Parsing schema from: ${schemaPath}`);
  const sql = fs.readFileSync(schemaPath, "utf8");

  const tables: Table[] = [];
  const enums: ParsedSchema["enums"] = [];
  const comments: Record<string, string> = {};

  // Extract comments first to associate them with tables and columns later
  let commentMatch;
  while ((commentMatch = COMMENT_ON_PATTERN.exec(sql)) !== null) {
    const identifier = commentMatch[1].replace(/"/g, "");
    const comment = commentMatch[2];
    comments[identifier] = comment;
  }

  // Parse enum types
  let enumMatch;
  while ((enumMatch = CREATE_ENUM_PATTERN.exec(sql)) !== null) {
    const schema = enumMatch[1]?.replace(/"/g, "") || "public";
    const name = enumMatch[2].replace(/"/g, "");
    const valuesStr = enumMatch[3];

    // Parse values from enum definition, handling quoted strings
    const values = valuesStr
      .split(",")
      .map((v) => v.trim())
      .map((v) => {
        if (v.startsWith("'") && v.endsWith("'")) {
          return v.substring(1, v.length - 1);
        }
        return v;
      });

    enums.push({ schema, name, values });
  }

  // Parse table definitions
  let tableMatch;
  while ((tableMatch = CREATE_TABLE_PATTERN.exec(sql)) !== null) {
    const schema =
      tableMatch[1]?.replace(/"/g, "").replace(".", "") || "public";
    const tableName = tableMatch[2].replace(/"/g, "");
    const tableBody = tableMatch[3];

    // Get table comment if available
    const tableIdentifier = `${schema}.${tableName}`;
    const tableDescription = comments[tableIdentifier] || null;

    const table: Table = {
      schema,
      name: tableName,
      columns: [],
      constraints: [],
      description: tableDescription,
    };

    // Split the table body into column and constraint definitions
    const definitions = splitTableBodyIntoDefinitions(tableBody);

    for (const def of definitions) {
      if (def.trim().startsWith("CONSTRAINT ")) {
        const constraint = parseConstraint(def);
        if (constraint) {
          table.constraints.push(constraint);
        }
      } else {
        const column = parseColumnDefinition(def);
        if (column) {
          // Check for column comments
          const columnIdentifier = `${schema}.${tableName}.${column.name}`;
          column.description = comments[columnIdentifier] || null;
          table.columns.push(column);
        }
      }
    }

    // Process constraints that are defined on columns
    processColumnConstraints(table);

    tables.push(table);
  }

  // Update foreign key references based on constraints
  updateForeignKeyReferences(tables);

  return { tables, enums };
}

/**
 * Split table body into individual column and constraint definitions
 */
function splitTableBodyIntoDefinitions(tableBody: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let current = "";

  for (let i = 0; i < tableBody.length; i++) {
    const char = tableBody[i];

    if (char === "(" || char === "[") {
      depth++;
    } else if (char === ")" || char === "]") {
      depth--;
    }

    if (char === "," && depth === 0) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    result.push(current.trim());
  }

  return result;
}

/**
 * Parse a column definition string
 */
function parseColumnDefinition(definition: string): TableColumn | null {
  // Pattern to match column name and type
  const columnPattern =
    /^"?([a-zA-Z0-9_]+)"?\s+([a-zA-Z0-9_ \[\]()]+)(?:\s+(.*))?$/;
  const match = definition.match(columnPattern);

  if (!match) return null;

  const name = match[1];
  const type = match[2];
  const constraints = match[3] || "";

  const isNullable = !constraints.includes("NOT NULL");
  const isPrimaryKey = constraints.includes("PRIMARY KEY");

  // Extract default value if present
  const defaultMatch = constraints.match(/DEFAULT\s+([^,\s]+)/i);
  const defaultValue = defaultMatch ? defaultMatch[1] : null;

  // Extract foreign key reference if present
  const foreignKeyMatch = constraints.match(
    /REFERENCES\s+(?:"?([a-zA-Z0-9_]+)"?\.)?"?([a-zA-Z0-9_]+)"?\s*(?:\("?([a-zA-Z0-9_]+)"?\))?/i
  );

  const foreignKey = foreignKeyMatch
    ? {
        table: foreignKeyMatch[2],
        column: foreignKeyMatch[3] || name, // If referenced column not specified, assume same name
      }
    : null;

  return {
    name,
    type,
    isNullable,
    isPrimaryKey,
    defaultValue,
    description: null, // Will be populated later
    foreignKey,
  };
}

/**
 * Parse a constraint definition
 */
function parseConstraint(definition: string): TableConstraint | null {
  // Check constraint type
  let type: TableConstraint["type"];
  if (definition.includes("PRIMARY KEY")) {
    type = "PRIMARY KEY";
  } else if (definition.includes("FOREIGN KEY")) {
    type = "FOREIGN KEY";
  } else if (definition.includes("UNIQUE")) {
    type = "UNIQUE";
  } else if (definition.includes("CHECK")) {
    type = "CHECK";
  } else {
    return null;
  }

  // Extract constraint name
  const nameMatch = definition.match(/CONSTRAINT\s+"?([a-zA-Z0-9_]+)"?\s+/);
  const name = nameMatch ? nameMatch[1] : "";

  // Extract affected columns
  const columnsMatch = definition.match(/\(([^)]+)\)/);
  const columns = columnsMatch
    ? columnsMatch[1].split(",").map((col) => col.trim().replace(/"/g, ""))
    : [];

  // For foreign keys, extract referenced table and columns
  let referencedTable: string | undefined;
  let referencedColumns: string[] | undefined;

  if (type === "FOREIGN KEY") {
    const referencesMatch = definition.match(
      /REFERENCES\s+(?:"?([a-zA-Z0-9_]+)"?\.)?"?([a-zA-Z0-9_]+)"?\s*(?:\(([^)]+)\))?/
    );

    if (referencesMatch) {
      referencedTable = referencesMatch[2];
      if (referencesMatch[3]) {
        referencedColumns = referencesMatch[3]
          .split(",")
          .map((col) => col.trim().replace(/"/g, ""));
      }
    }
  }

  return {
    name,
    type,
    columns,
    referencedTable,
    referencedColumns,
  };
}

/**
 * Process column constraints to update column properties
 */
function processColumnConstraints(table: Table): void {
  // Set primary key flag for columns listed in PRIMARY KEY constraints
  const pkConstraints = table.constraints.filter(
    (c) => c.type === "PRIMARY KEY"
  );
  for (const constraint of pkConstraints) {
    for (const colName of constraint.columns) {
      const column = table.columns.find((c) => c.name === colName);
      if (column) {
        column.isPrimaryKey = true;
      }
    }
  }
}

/**
 * Update foreign key references based on table constraints
 */
function updateForeignKeyReferences(tables: Table[]): void {
  // For each table, process its foreign key constraints
  for (const table of tables) {
    const fkConstraints = table.constraints.filter(
      (c) => c.type === "FOREIGN KEY"
    );

    for (const constraint of fkConstraints) {
      if (!constraint.referencedTable || !constraint.columns.length) continue;

      // For each column referenced in this constraint
      for (let i = 0; i < constraint.columns.length; i++) {
        const columnName = constraint.columns[i];
        const column = table.columns.find((c) => c.name === columnName);

        // If we found the column and it doesn't already have a foreign key reference
        if (column && !column.foreignKey) {
          // Get the referenced column (if available)
          const referencedColumnName =
            constraint.referencedColumns?.[i] || columnName;

          column.foreignKey = {
            table: constraint.referencedTable,
            column: referencedColumnName,
          };
        }
      }
    }
  }
}
