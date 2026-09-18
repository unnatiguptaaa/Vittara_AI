import { sendChatMessage, clearSession, getSessionHistory } from '../services/geminiService.js';
import { v4 as uuidv4 } from 'uuid';

export async function handleChat(req, res, next) {
  try {
    const { message, sessionId = uuidv4(), language = 'English', contextData } = req.body;
    const customApiKey = req.headers['x-gemini-key'];

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid message.'
      });
    }

    const response = await sendChatMessage({
      message,
      sessionId,
      language,
      customApiKey,
      contextData
    });

    return res.status(200).json({
      success: true,
      sessionId,
      data: response
    });
  } catch (error) {
    next(error);
  }
}

export async function handleClearChat(req, res, next) {
  try {
    const { sessionId } = req.body;
    if (sessionId) {
      clearSession(sessionId);
    }
    return res.status(200).json({
      success: true,
      message: 'Conversation cleared successfully.'
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetChatHistory(req, res, next) {
  try {
    const { sessionId } = req.params;
    const history = getSessionHistory(sessionId);
    return res.status(200).json({
      success: true,
      sessionId,
      history
    });
  } catch (error) {
    next(error);
  }
}
