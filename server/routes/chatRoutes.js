import { Router } from 'express';
import { handleChat, handleClearChat, handleGetChatHistory } from '../controllers/chatController.js';

const router = Router();

router.post('/', handleChat);
router.post('/clear', handleClearChat);
router.get('/history/:sessionId', handleGetChatHistory);

export default router;
