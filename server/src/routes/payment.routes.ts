import { Router } from 'express';
import { createPaymentPreference } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/preference', authenticate, createPaymentPreference);

export default router;
