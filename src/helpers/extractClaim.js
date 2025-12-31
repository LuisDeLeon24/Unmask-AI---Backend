import { extractClaimWithLLM } from '../services/claim.service.js';
import { extractClaimFromText } from './extractClaimFromText.js';

export async function extractClaim(cleanText) {
  const llmClaim = await extractClaimWithLLM(cleanText);

  if (typeof llmClaim === 'string' && llmClaim.length > 20) {
    return llmClaim;
  }

  return extractClaimFromText(cleanText);
}
