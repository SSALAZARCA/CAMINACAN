import { Router } from 'express';
import { login, register, getMe, forgotPassword, resetPassword, updateProfile, deleteAccount, updateAvatar } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../utils/storage';

const router = Router();


import { validate } from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../utils/schemas';

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateProfile);
router.post('/me/avatar', authenticate, upload.single('avatar'), updateAvatar);
router.delete('/me', authenticate, deleteAccount);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
