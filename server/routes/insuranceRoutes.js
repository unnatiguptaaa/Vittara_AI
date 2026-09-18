import { Router } from 'express';
import { getAllInsurance, getInsuranceById } from '../controllers/insuranceController.js';

const router = Router();

router.get('/', getAllInsurance);
router.get('/:id', getInsuranceById);

export default router;
