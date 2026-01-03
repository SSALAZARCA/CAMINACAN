import { Router } from 'express';
import { login, register, getMe, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();


import { validate } from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../utils/schemas';

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
