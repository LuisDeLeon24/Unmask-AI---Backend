function normalizeText(input) {
  if (!input) return "";

  if (typeof input === "string") {
    return input
      .toLowerCase()
      .replace(/[^a-záéíóúñ0-9\s]/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (typeof input === "object") {
    return Object.values(input)
      .map(v => normalizeText(v))
      .join(" ");
  }
  return String(input).toLowerCase();
}

function extractKeywords(claim) {
  return normalizeText(claim)
    .split(" ")
    .filter(word => word.length > 3);
}

function computeMatchScore(itemText, keywords) {
  let hits = 0;

  for (const word of keywords) {
    if (itemText.includes(word)) hits++;
  }

  return keywords.length > 0 ? hits / keywords.length : 0;
}

export function matchNewsToClaim(newsItems, claim, options = {}) {
  const { threshold = 0.5, maxResults = 50 } = options;

  if (!Array.isArray(newsItems) || newsItems.length === 0 || !claim) return [];

  const keywords = extractKeywords(claim);
  if (keywords.length === 0) return [];

  const matches = [];

  for (const item of newsItems) {
    if (!item || (!item.title && !item.summary)) continue; // skip invalid items

    const text = normalizeText(`${item.title || ""} ${item.summary || ""}`);
    const score = computeMatchScore(text, keywords);

    if (score >= threshold) {
      matches.push({
        ...item,
        matchScore: Number(score.toFixed(2)),
        weight: item.weight || 1,   
        tier: item.tier || 3        
      });
    }
  }

  return matches
    .sort((a, b) => (b.matchScore * (b.weight || 1)) - (a.matchScore * (a.weight || 1)))
    .slice(0, maxResults);
}
