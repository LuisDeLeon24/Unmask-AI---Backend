import axios from 'axios';

const API_URL = 'https://lbfdk7jecaaep333.aistudio-app.com/ocr';

export async function sendImageBase64ToOCR({
  imageBase64,
  mimeType = 'image/png'
}) {
  console.log('OCR client called');

  if (!imageBase64) {
    console.error('imageBase64 missing');
    throw new Error('imageBase64 is required');
  }

  console.log('imageBase64 length:', imageBase64.length);

  const cleanBase64 = imageBase64.includes('base64,')
    ? imageBase64.split('base64,')[1]
    : imageBase64;

  console.log('cleanBase64 length:', cleanBase64.length);

  if (!mimeType.startsWith('image/')) {
    console.error('Invalid mimeType:', mimeType);
    throw new Error(`Invalid mimeType: ${mimeType}`);
  }

  console.log('mimeType:', mimeType);

  const payload = {
    file: cleanBase64,
    fileType: 1,
    useDocOrientationClassify: false,
    useDocUnwarping: false,
    useTextlineOrientation: false
  };

  console.log('Sending request to OCR API');
  console.log('API_URL:', API_URL);
  console.log('fileType:', payload.fileType);

  const headers = {
    Authorization: `token ${process.env.TOKEN}`,
    'Content-Type': 'application/json'
  };

  console.log('TOKEN exists:', !!process.env.TOKEN);

  try {
    const response = await axios.post(API_URL, payload, { headers });

    console.log('OCR response status:', response.status);

    if (!response.data) {
      console.error('OCR response has no data');
    } else {
      console.log(
        'OCR response keys:',
        Object.keys(response.data)
      );
    }

    if (!response.data?.result) {
      console.error('OCR response missing result');
      console.log('Full OCR response:', response.data);
      throw new Error('OCR API respondió sin result');
    }

    console.log(
      'OCR pages:',
      response.data.result.ocrResults?.length ?? 0
    );

    return response.data.result;

  } catch (error) {
    console.error('OCR REQUEST FAILED');

    if (error.response) {
      console.error('OCR status:', error.response.status);
      console.error('OCR response data:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }

    throw error;
  }
}

