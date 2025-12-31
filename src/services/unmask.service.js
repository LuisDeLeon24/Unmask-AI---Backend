import { sendImageBase64ToOCR } from '../clients/ocr.client.js';
import { chatWithLLM } from '../clients/llm.client.js';
import { CleanText } from '../helpers/cleantext.js';
import { buildPrompt } from '../helpers/prompt.js';
import { safeParseJSON } from '../validators/JSON.validator.js';
import { extractClaim } from '../helpers/extractClaim.js'; 
import { searchNews } from '../helpers/rssReader.js'; 
import { matchNewsToClaim } from '../helpers/matcher.js';
import { verifyClaim } from '../validators/News.validator.js';

export async function analyzeImageWithEvidenceFirst(imageBase64) {
  if (!imageBase64) throw new Error('imageBase64 is required');

  const ocrResult = await sendImageBase64ToOCR({ imageBase64 });
  const cleanText = CleanText(ocrResult);

  if (!cleanText || cleanText.length < 20) {
    throw new Error('Texto insuficiente para análisis');
  }

  const claim = await extractClaim(cleanText);
  if (!claim) {
    throw new Error('No se pudo extraer un claim verificable');
  }

  console.log(`🔍 Buscando evidencias para: ${claim}`);
  const newsFound = await searchNews(claim); 

  const matched = matchNewsToClaim(newsFound, claim);
  const verification = verifyClaim(claim, matched);

  const evidenceSummary = verification.evidence?.map(e => ({
    source: e.source,
    link: e.link,
    title: e.title
  })) || [];

  const promptInput = buildPrompt({
    text: cleanText,
    claim: claim,
    verification: {
      verdict: verification.verdict, 
      evidence: evidenceSummary
    }
  });

  const llmResponse = await chatWithLLM({
    messages: promptInput,
    temperature: 0.1
  });

  const analysis = safeParseJSON(llmResponse.content);

  return {
    text: cleanText,
    claim,
    verification: {
      verdict: verification.verdict,
      confidence: verification.confidence,
      evidence: evidenceSummary
    },
    analysis
  };
}

export async function analyzeImageForFakeNews(imageBase64) {
  if (!imageBase64) {
    throw new Error('imageBase64 is required');
  }
 
  
  const ocrResult = await sendImageBase64ToOCR({ imageBase64 });


  const extractedText = CleanText(ocrResult);

  if (!extractedText || extractedText.length < 20) {
    throw new Error('Texto insuficiente para análisis');
  }


  const promptInput = buildPrompt(extractedText);

  
  const llmResponse = await chatWithLLM({
    messages: promptInput,
    temperature: 0.1
  });

  const analysis = safeParseJSON(llmResponse.content);

  return {
    text: extractedText,
    analysis
  };
}
