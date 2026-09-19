import { Router } from 'express';
import { handleChat, handleClearChat, handleGetChatHistory, handleGetAllSessions } from '../controllers/chatController.js';

const router = Router();

router.get('/sessions', handleGetAllSessions);
router.post('/', handleChat);
router.post('/clear', handleClearChat);
router.get('/history/:sessionId', handleGetChatHistory);

export default router;
