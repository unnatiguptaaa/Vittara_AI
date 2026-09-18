/**
 * Centralized Express Error Handling Middleware
 */
export function errorHandler(err, req, res, next) {
  console.error(`[ErrorHandler] Error encountered on ${req.method} ${req.originalUrl}:`, err.message);

  const status = err.statusCode || err.status || 500;
  let message = err.message || 'An unexpected error occurred.';

  // Map known error signatures
  if (err.message?.includes('valid loan amount')) {
    return res.status(400).json({ success: false, error: 'Please enter a valid loan amount.' });
  }

  if (err.message?.includes('smaller document') || err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, error: 'Please upload a smaller document.' });
  }

  if (err.message?.includes('Supported formats') || err.code === 'UNSUPPORTED_FILE_TYPE') {
    return res.status(400).json({ success: false, error: 'Supported formats: PDF, TXT.' });
  }

  if (err.message?.includes('No matching demo products')) {
    return res.status(404).json({ success: false, error: 'No matching demo products found.' });
  }

  if (err.message?.includes('Financial data could not be loaded') || err.name === 'MongooseServerSelectionError') {
    return res.status(503).json({ success: false, error: 'Financial data could not be loaded.' });
  }

  if (err.message?.includes('Gemini') || err.message?.includes('API key')) {
    return res.status(503).json({ success: false, error: 'Vittara AI is temporarily unavailable. Please try again.' });
  }

  return res.status(status).json({
    success: false,
    error: message
  });
}
