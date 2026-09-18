import { Router } from 'express';
import { upload, handleUploadErrors } from '../middleware/uploadMiddleware.js';
import { analyzeDocument } from '../controllers/documentController.js';

const router = Router();

router.post('/analyze', upload.single('document'), handleUploadErrors, analyzeDocument);

export default router;
