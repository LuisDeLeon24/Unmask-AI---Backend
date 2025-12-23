import { sendImageBase64ToOCR } from '../clients/ocr.client.js';
import { chatWithLLM } from '../clients/llm.client.js';
import { CleanText } from '../helpers/cleantext.js';
import { buildPrompt } from '../helpers/prompt.js';
import { safeParseJSON } from '../validators/JSON.validator.js';

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
