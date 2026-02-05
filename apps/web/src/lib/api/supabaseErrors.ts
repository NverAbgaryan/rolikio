export function isSupabaseSchemaCacheMiss(message: string) {
  const m = message.toLowerCase();
  return (
    m.includes("schema cache") ||
    m.includes("could not find the table") ||
    m.includes("relation") && m.includes("does not exist")
  );
}

export function isSupabaseRlsOrPermission(message: string) {
  const m = message.toLowerCase();
  return (
    m.includes("row-level security") ||
    m.includes("permission denied") ||
    m.includes("not allowed")
  );
}

