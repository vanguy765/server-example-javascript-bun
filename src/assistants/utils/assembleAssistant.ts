// All of the assistants are in the src/assistants/ directory, companyName/ folder
// If a folder in src/assistants/ matches companyName, import all the files in the folder
// to constants of similar names.

export default function assembleAssistants(availableAssistants: any) {
  const assembledAssistants: any = {};

  for (const [assistantName, assistant] of Object.entries(
    availableAssistants
  )) {
    assembledAssistants[assistantName] = assistant;
  }

  return assembledAssistants;
}
