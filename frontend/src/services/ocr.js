import Tesseract from 'tesseract.js';

export const extractTextFromImage = async (imageFile, onProgress) => {
  try {
    const result = await Tesseract.recognize(
      imageFile,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text' && onProgress) {
            onProgress(Math.round(m.progress * 100));
          }
        }
      }
    );
    
    return result.data.text.trim();
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error("Failed to extract text from image.");
  }
};
