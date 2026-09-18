import { extractDocumentText, parseLocalDocumentFallback } from '../services/documentService.js';
import { analyzeDocumentWithGemini } from '../services/geminiService.js';

/**
 * POST /api/document/analyze
 * Extracts document text and performs structured financial audit with Gemini 3.8 Flash
 */
export async function analyzeDocument(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please select a document to upload.'
      });
    }

    const language = req.body.language || req.headers['x-language'] || 'English';
    const customApiKey = req.headers['x-gemini-key'];

    // 1. Extract text from PDF or TXT
    const extraction = await extractDocumentText(req.file);

    // 2. Query Gemini 3.8 Flash
    const aiResult = await analyzeDocumentWithGemini({
      documentText: extraction.text,
      language,
      customApiKey
    });

    let finalAnalysis = '';
    let source = 'gemini-3.8-flash';

    if (aiResult && aiResult.analysis) {
      finalAnalysis = aiResult.analysis;
    } else {
      // Deterministic audited fallback ensuring "Not found in document." for missing fields
      finalAnalysis = parseLocalDocumentFallback(extraction.text, language);
      source = 'deterministic_auditor';
    }

    return res.status(200).json({
      success: true,
      data: {
        filename: extraction.filename,
        fileType: extraction.fileType,
        charCount: extraction.charCount,
        wordCount: extraction.wordCount,
        language,
        source,
        extractedTextPreview: extraction.text.slice(0, 1000) + (extraction.text.length > 1000 ? '...' : ''),
        analysis: finalAnalysis
      }
    });

  } catch (error) {
    next(error);
  }
}
