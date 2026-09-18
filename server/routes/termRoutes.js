import { Router } from 'express';
import { getAllTerms, getTermExplanation } from '../controllers/termController.js';

const router = Router();

router.get('/', getAllTerms);
router.get('/:term', getTermExplanation);

export default router;
