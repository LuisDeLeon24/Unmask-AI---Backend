import { sendImageBase64ToOCR } from "../clients/ocr.client.js";
import { searchMediaCoverage } from "../clients/reports.client.js";
import { CleanText } from "../helpers/cleantext.js";

/**
 * Analiza una imagen: extrae texto y verifica cobertura mediática.
 * @param {string} imageBase64 - La imagen en Base64
 * @returns {Promise<Object>} - { text, cleanedText, mediaReport }
 */
export async function analyzeImageWithMediaCheck(imageBase64) {
  if (!imageBase64) {
    throw new Error("imageBase64 is required");
  }

  try {
    console.log("Sending image to OCR...");
    const ocrResult = await sendImageBase64ToOCR({ imageBase64 });
    console.log("OCR result received:", ocrResult);

    const extractedText = CleanText(ocrResult);
    console.log("Cleaned text:", extractedText);

    if (!extractedText || extractedText.length < 20) {
      throw new Error("Texto insuficiente para análisis de medios");
    }

    console.log("Sending text to Gradio media search...");
    const mediaReport = await searchMediaCoverage(extractedText);
    console.log("Media report received:", mediaReport);

    return {
      cleanedText: extractedText,
      mediaReport
    };

  } catch (error) {
    console.error("Media verification service failed:", error);
    throw error;
  }
}
