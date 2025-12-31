function computeWeightedScore(items) {
  return items.reduce((acc, item) => {
    const tierMultiplier =
      item.tier === 1 ? 1.0 :
      item.tier === 2 ? 0.7 :
      0.4;

    return acc + (item.matchScore * item.weight * tierMultiplier);
  }, 0);
}

function getUniqueSources(items) {
  return [...new Set(items.map(i => i.source))];
}

export function verifyClaim(claim, matchedNews) {
  if (!matchedNews || matchedNews.length === 0) {
    return {
      claim,
      verdict: "No Evidence Found",
      confidence: 0.2,
      explanation: "No se encontraron fuentes confiables que confirmen esta noticia.",
      evidence: []
    };
  }

  const tier1 = matchedNews.filter(n => n.tier === 1);
  const tier2 = matchedNews.filter(n => n.tier === 2);
  const tier3 = matchedNews.filter(n => n.tier === 3);
  const institutional = matchedNews.filter(n => n.institutional);

  const weightedScore = computeWeightedScore(matchedNews);
  const sources = getUniqueSources(matchedNews);

  let verdict = "Unverified";
  let confidence = 0.4;
  let explanation = "La información existe, pero no está suficientemente confirmada.";

  if (institutional.length >= 1 && tier1.length >= 1) {
    verdict = "Highly Likely True";
    confidence = 0.9;
    explanation = "Confirmada por fuente institucional y medio de tier 1.";
  }
  else if (tier1.length >= 2) {
    verdict = "Likely True";
    confidence = 0.8;
    explanation = "Confirmada por múltiples medios de alta credibilidad.";
  }
  else if (tier1.length === 1 && tier2.length >= 2) {
    verdict = "Probably True";
    confidence = 0.65;
    explanation = "Confirmada por una fuente principal y múltiples secundarias.";
  }
  else if (tier3.length >= 3 && tier1.length === 0) {
    verdict = "Low Confidence";
    confidence = 0.35;
    explanation = "Solo medios de baja prioridad reportan esta información.";
  }

  confidence = Math.min(
    0.95,
    Number((confidence + weightedScore / 10).toFixed(2))
  );

  return {
    claim,
    verdict,
    confidence,
    sourcesCount: sources.length,
    tierBreakdown: {
      tier1: tier1.length,
      tier2: tier2.length,
      tier3: tier3.length,
      institutional: institutional.length
    },
    sources,
    evidence: matchedNews
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10)
  };
}
