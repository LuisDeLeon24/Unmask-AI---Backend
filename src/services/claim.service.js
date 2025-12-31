import { chatWithLLM } from '../clients/llm.client.js';
import { safeParseJSON } from '../validators/JSON.validator.js';

export async function extractClaimWithLLM(cleanText) {

  if (typeof cleanText !== 'string' || cleanText.length < 20) {
    console.warn('Text too short for claim extraction');
    return null;
  }

  const messages = [
    {
      role: 'system',
      content: `
You are a fact-checking system.

Task:
Extract the main verifiable factual claim from the given text.

Rules:
- Ignore clickbait words, timestamps, emojis, OCR noise.
- Do NOT add new information.
- Do NOT speculate.
- If there is no clear factual claim, return null.
- The claim must be one concise sentence.

Return ONLY valid JSON in this format:
{
  "claim": string | null
}
`
    },
    {
      role: 'user',
      content: cleanText
    }
  ];

  let response;
  try {
    response = await chatWithLLM({
      messages,
      temperature: 0
    });
  } catch (err) {
    console.error('LLM request failed:', err);
    return null;
  }

  const parsed = safeParseJSON(response.content);

  if (!parsed) {
    console.warn('Failed to parse LLM JSON output');
    return null;
  }

  if (
    typeof parsed !== 'object' ||
    !('claim' in parsed) ||
    parsed.claim === null
  ) {
    console.warn('No valid claim found in parsed JSON');
    return null;
  }

  if (typeof parsed.claim !== 'string') {
    console.warn('Claim is not a string:', parsed.claim);
    return null;
  }

  return parsed.claim.trim();
}
