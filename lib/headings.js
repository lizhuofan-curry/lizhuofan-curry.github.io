export function headingId(text) {
  return `section-${String(text).trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]/gu, "")}`;
}
