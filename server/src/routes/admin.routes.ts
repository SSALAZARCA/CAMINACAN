import { Router } from 'express';
import { getDashboardStats, getPayouts, processPayout, updateConfig } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/stats', getDashboardStats);
router.get('/payouts', getPayouts);
router.post('/payouts/process', processPayout);

router.post('/config', updateConfig);

export default router;
