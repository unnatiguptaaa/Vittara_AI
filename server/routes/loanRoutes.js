import { Router } from 'express';
import { calculateLoan, getAllLoans, getLoanById } from '../controllers/loanController.js';

const router = Router();

router.post('/calculate', calculateLoan);
router.get('/', getAllLoans);
router.get('/:id', getLoanById);

export default router;
