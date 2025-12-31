import { analyzeImageForFakeNews, analyzeImageWithEvidenceFirst } from '../services/unmask.service.js';

export async function analyzeImageController(req, res) {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        error: 'imageBase64 is required'
      });
    }

    const result = await analyzeImageForFakeNews(imageBase64);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[UnmaskController]', error.message);

    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

export async function analyzeImageNewsController(req, res) {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'imageBase64 is required'
      });
    }

    const result = await analyzeImageWithEvidenceFirst(imageBase64);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('[ANALYZE_IMAGE_ERROR]', error.message);

    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
