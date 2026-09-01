import Tesseract from 'tesseract.js';

const OCR_LANGUAGE_MAP = {
  en: 'eng',
  hi: 'hin+eng',
  te: 'tel',
};

const SUPPORTED_LANGUAGES = ['en', 'hi', 'te'];

const getOCRLanguage = (language) => {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return OCR_LANGUAGE_MAP.en;
  }

  return OCR_LANGUAGE_MAP[language];
};

export const extractTextFromImage = async (
  imageFile,
  onProgress,
  language = 'en'
) => {
  try {
    if (!imageFile) {
      throw new Error('No image file was provided.');
    }

    const ocrLanguage = getOCRLanguage(language);

    const result = await Tesseract.recognize(
      imageFile,
      ocrLanguage,
      {
        logger: (message) => {
          if (
            message.status === 'recognizing text' &&
            typeof onProgress === 'function'
          ) {
            onProgress(
              Math.round(message.progress * 100)
            );
          }
        },
      }
    );

    const extractedText =
      result.data.text.trim();

    console.log(
      'OCR EXTRACTED TEXT:',
      extractedText
    );

    return extractedText;
  } catch (error) {
    console.error('OCR Error:', error);

    throw new Error(
      'Failed to extract text from image.'
    );
  }
};