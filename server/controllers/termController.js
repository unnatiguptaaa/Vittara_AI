import { TermRepository } from '../models/Term.js';
import { explainTermWithGemini } from '../services/geminiService.js';

/**
 * GET /api/terms
 * List all available financial terms
 */
export async function getAllTerms(req, res, next) {
  try {
    const terms = await TermRepository.find({});
    return res.status(200).json({
      success: true,
      count: terms.length,
      data: terms
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/terms/:term
 * Dynamic explanation via Gemini + verified database definition
 */
export async function getTermExplanation(req, res, next) {
  try {
    const { term } = req.params;
    const language = req.query.lang || req.headers['x-language'] || 'English';
    const customApiKey = req.headers['x-gemini-key'];

    if (!term || typeof term !== 'string' || !term.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid financial term.'
      });
    }

    const cleanTerm = term.trim();

    // Query database for baseline record
    let dbTerm = await TermRepository.findOne({
      term: { $regex: `^${cleanTerm}$`, $options: 'i' }
    });

    if (!dbTerm) {
      dbTerm = await TermRepository.findOne({
        aliases: { $in: [cleanTerm] }
      });
    }

    if (!dbTerm) {
      // Partial search
      const all = await TermRepository.find({});
      dbTerm = all.find(t => 
        t.term.toLowerCase().includes(cleanTerm.toLowerCase()) || 
        cleanTerm.toLowerCase().includes(t.term.toLowerCase())
      );
    }

    // Call Gemini 3.8 Flash through geminiService
    const aiResult = await explainTermWithGemini({
      term: cleanTerm,
      language,
      customApiKey,
      dbData: dbTerm
    });

    return res.status(200).json({
      success: true,
      term: dbTerm ? dbTerm.term : cleanTerm,
      language,
      category: dbTerm ? dbTerm.category : 'General Finance',
      shortDefinition: dbTerm ? dbTerm.shortDefinition : 'Financial term definition.',
      explanation: aiResult.explanation,
      example: dbTerm ? dbTerm.example : null,
      analogy: dbTerm ? dbTerm.analogy : null,
      source: aiResult.source,
      databaseRecord: dbTerm || null
    });

  } catch (error) {
    next(error);
  }
}
