export function extractClaimFromText(text) {
  const sentences = text
    .split(/[\.\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 20);

  return sentences[0] || null;
}
