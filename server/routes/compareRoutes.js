import { Router } from 'express';
import { compareLoans } from '../controllers/compareController.js';

const router = Router();

router.post('/', compareLoans);

export default router;
