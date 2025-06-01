import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Paths
const SCHEMA_SQL_PATH = path.join(__dirname, "../src/supabase/schema.sql");
const SCHEMA_ANALYSIS_PATH = path.join(
  __dirname,
  "../examples/schema-report/schema-analysis.md"
);

// Parse SQL CREATE TABLE statements
const parseCreateTableStatements = (sqlContent: string) => {
  const tables = [];

  // Regular expression to match CREATE TABLE statements
  const createTableRegex =
    /CREATE TABLE (IF NOT EXISTS)?\s*(?:(?:[a-zA-Z0-9_"]+)\.)?([a-zA-Z0-9_"]+)\s*\(([\s\S]+?)\);/g;

  // Find all CREATE TABLE statements
  let tableMatch;
  while ((tableMatch = createTableRegex.exec(sqlContent)) !== null) {
    const tableName = tableMatch[2].replace(/"/g, "");
    const columnsDefinition = tableMatch[3];

    const columns = [];

    // Regular expression to match column definitions within CREATE TABLE
    const columnDefRegex =
      /\s*"?([a-zA-Z0-9_]+)"?\s+([a-zA-Z0-9_ \[\]]+)(?:\s+COLLATE\s+[a-zA-Z0-9_"]+)?(?:\s+NOT NULL)?(?:\s+DEFAULT\s+[^,]+)?(?:\s+CONSTRAINT\s+[a-zA-Z0-9_"]+)?(?:\s+PRIMARY KEY)?(?:\s+REFERENCES\s+[^,]+)?/g;

    // Find all column definitions
    let columnMatch;
    while ((columnMatch = columnDefRegex.exec(columnsDefinition)) !== null) {
      const columnName = columnMatch[1].replace(/"/g, "");
      const columnType = columnMatch[2].trim();

      // Check if the column is nullable
      const isNullable = !columnsDefinition.includes(
        `${columnName}"? NOT NULL`
      );

      // Check if the column is a primary key
      const isPrimaryKey =
        columnsDefinition.includes(`${columnName}"? PRIMARY KEY`) ||
        columnsDefinition.includes(`PRIMARY KEY\\s*\\("?${columnName}"?\\)`);

      // Check for foreign key references
      const foreignKeyRegex = new RegExp(
        `FOREIGN KEY\\s*\\("?${columnName}"?\\)\\s*REFERENCES\\s*"?([a-zA-Z0-9_]+)"?\\.?"?([a-zA-Z0-9_]+)"?`,
        "i"
      );
      const foreignKeyMatch = columnsDefinition.match(foreignKeyRegex);

      let foreignKeyInfo = null;
      if (foreignKeyMatch) {
        foreignKeyInfo = {
          table: foreignKeyMatch[1],
          column: foreignKeyMatch[2],
        };
      }

      // Check for default values
      const defaultValueRegex = new RegExp(
        `"?${columnName}"?[^,]*DEFAULT\\s+([^,]+)`,
        "i"
      );
      const defaultValueMatch = columnsDefinition.match(defaultValueRegex);
      const defaultValue = defaultValueMatch ? defaultValueMatch[1] : null;

      columns.push({
        name: columnName,
        type: columnType,
        isNullable,
        isPrimaryKey,
        foreignKey: foreignKeyInfo,
        defaultValue,
      });
    }

    // Get primary key information
    const primaryKeyRegex =
      /PRIMARY KEY\s*\("?([a-zA-Z0-9_]+"?(?:\s*,\s*"?[a-zA-Z0-9_]+"?)*)\)/i;
    const primaryKeyMatch = columnsDefinition.match(primaryKeyRegex);
    const primaryKeys = primaryKeyMatch
      ? primaryKeyMatch[1].split(",").map((key) => key.trim().replace(/"/g, ""))
      : [];

    // Get foreign key information
    const foreignKeys = [];
    const foreignKeyRegex =
      /FOREIGN KEY\s*\("?([a-zA-Z0-9_]+"?(?:\s*,\s*"?[a-zA-Z0-9_]+"?)*)\)\s*REFERENCES\s*"?([a-zA-Z0-9_]+)"?(?:\.?"?([a-zA-Z0-9_]+)"?)?\s*(?:\("?([a-zA-Z0-9_]+"?(?:\s*,\s*"?[a-zA-Z0-9_]+"?)*)\))?/g;

    let foreignKeyMatch;
    while (
      (foreignKeyMatch = foreignKeyRegex.exec(columnsDefinition)) !== null
    ) {
      const sourceColumns = foreignKeyMatch[1]
        .split(",")
        .map((col) => col.trim().replace(/"/g, ""));
      const targetTable = foreignKeyMatch[2].replace(/"/g, "");
      const targetSchema = foreignKeyMatch[3]
        ? foreignKeyMatch[3].replace(/"/g, "")
        : "public";
      const targetColumns = foreignKeyMatch[4]
        ? foreignKeyMatch[4]
            .split(",")
            .map((col) => col.trim().replace(/"/g, ""))
        : sourceColumns; // Default to same column names if not specified

      foreignKeys.push({
        sourceColumns,
        targetSchema,
        targetTable,
        targetColumns,
      });
    }

    // Get indexes
    const indexes = [];
    // This would require parsing CREATE INDEX statements which are outside the CREATE TABLE

    tables.push({
      name: tableName,
      columns,
      primaryKeys,
      foreignKeys,
      indexes,
    });
  }

  return tables;
};

// Parse SQL CREATE TYPE statements for enums
const parseCreateEnumStatements = (sqlContent: string) => {
  const enums = [];

  // Regular expression to match CREATE TYPE ... AS ENUM statements
  const createEnumRegex =
    /CREATE TYPE (IF NOT EXISTS)?\s*(?:(?:[a-zA-Z0-9_"]+)\.)?([a-zA-Z0-9_"]+)\s+AS ENUM\s*\(([\s\S]+?)\);/g;

  let enumMatch;
  while ((enumMatch = createEnumRegex.exec(sqlContent)) !== null) {
    const enumName = enumMatch[2].replace(/"/g, "");
    const enumValues = enumMatch[3]
      .split(",")
      .map((value) => value.trim().replace(/^'|'$/g, "").replace(/\\'/g, "'"));

    enums.push({
      name: enumName,
      values: enumValues,
    });
  }

  return enums;
};

// Find relationships between tables
const findRelationships = (tables) => {
  const relationships = [];

  tables.forEach((table) => {
    table.foreignKeys.forEach((fk) => {
      relationships.push({
        sourceTable: table.name,
        sourceColumns: fk.sourceColumns,
        targetTable: fk.targetTable,
        targetColumns: fk.targetColumns,
        relationship: "many-to-one", // Default, could be refined
      });
    });
  });

  return relationships;
};

// Generate Markdown report
const generateMarkdownReport = (tables, enums, relationships) => {
  let markdown = `# Database Schema Analysis\n\n`;
  markdown += `Generated on: ${new Date().toISOString()}\n\n`;

  // Tables
  markdown += `## Tables (${tables.length})\n\n`;

  tables.forEach((table) => {
    markdown += `### ${table.name}\n\n`;

    // Columns
    markdown += `#### Columns\n\n`;
    markdown += `| Name | Type | Nullable | Primary Key | Default |\n`;
    markdown += `|------|------|----------|-------------|--------|\n`;

    table.columns.forEach((column) => {
      markdown += `| ${column.name} | ${column.type} | ${
        column.isNullable ? "Yes" : "No"
      } | ${column.isPrimaryKey ? "Yes" : "No"} | ${
        column.defaultValue || ""
      } |\n`;
    });

    markdown += `\n`;

    // Primary Keys
    if (table.primaryKeys.length > 0) {
      markdown += `#### Primary Key\n\n`;
      markdown += `- ${table.primaryKeys.join(", ")}\n\n`;
    }

    // Foreign Keys
    if (table.foreignKeys.length > 0) {
      markdown += `#### Foreign Keys\n\n`;

      table.foreignKeys.forEach((fk) => {
        markdown += `- \`${fk.sourceColumns.join(", ")}\` → \`${
          fk.targetSchema
        }.${fk.targetTable}(${fk.targetColumns.join(", ")})\`\n`;
      });

      markdown += `\n`;
    }
  });

  // Enums
  if (enums.length > 0) {
    markdown += `## Enums (${enums.length})\n\n`;

    enums.forEach((enumType) => {
      markdown += `### ${enumType.name}\n\n`;
      markdown += `Values: ${enumType.values
        .map((v) => `\`${v}\``)
        .join(", ")}\n\n`;
    });
  }

  // Relationships
  if (relationships.length > 0) {
    markdown += `## Table Relationships (${relationships.length})\n\n`;

    markdown += `| Source Table | Source Columns | Relationship | Target Table | Target Columns |\n`;
    markdown += `|-------------|---------------|-------------|-------------|---------------|\n`;

    relationships.forEach((rel) => {
      markdown += `| ${rel.sourceTable} | ${rel.sourceColumns.join(", ")} | ${
        rel.relationship
      } | ${rel.targetTable} | ${rel.targetColumns.join(", ")} |\n`;
    });

    markdown += `\n`;
  }

  // Database Diagram Note
  markdown += `## Database Diagram\n\n`;
  markdown += `You can visualize this schema using tools like [dbdiagram.io](https://dbdiagram.io) or [drawSQL](https://drawsql.app/) by copy-pasting the schema.sql content.\n`;

  return markdown;
};

async function analyzeSchema() {
  try {
    console.log("=== Schema Analysis Tool ===");

    // Step 1: Check if schema.sql exists, if not, generate it
    if (!fs.existsSync(SCHEMA_SQL_PATH)) {
      console.log("Schema file not found, dumping schema from database...");
      const dumpCommand = `pg_dump --schema-only --no-owner --no-acl -f "${SCHEMA_SQL_PATH}" -h 127.0.0.1 -p 54322 -U postgres postgres`;

      try {
        await execAsync(dumpCommand);
        console.log(`Schema successfully dumped to: ${SCHEMA_SQL_PATH}`);
      } catch (dumpError) {
        console.error("Error dumping schema:", dumpError);
        console.error("Please manually create the schema.sql file");
        process.exit(1);
      }
    }

    // Step 2: Read the schema.sql file
    console.log(`Reading schema from: ${SCHEMA_SQL_PATH}`);
    const schemaContent = fs.readFileSync(SCHEMA_SQL_PATH, "utf8");

    // Step 3: Parse the schema
    console.log("Analyzing schema structure...");
    const tables = parseCreateTableStatements(schemaContent);
    const enums = parseCreateEnumStatements(schemaContent);
    const relationships = findRelationships(tables);

    console.log(
      `Found ${tables.length} tables, ${enums.length} enums, and ${relationships.length} relationships`
    );

    // Step 4: Generate report
    console.log("Generating schema analysis report...");

    // Ensure directory exists
    const reportDir = path.dirname(SCHEMA_ANALYSIS_PATH);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const report = generateMarkdownReport(tables, enums, relationships);
    fs.writeFileSync(SCHEMA_ANALYSIS_PATH, report);

    console.log(`Schema analysis report written to: ${SCHEMA_ANALYSIS_PATH}`);
    console.log("\nSchema analysis complete!");
  } catch (error) {
    console.error("Error analyzing schema:", error);
    process.exit(1);
  }
}

// Run the analysis
analyzeSchema();
