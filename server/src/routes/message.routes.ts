import { Router } from 'express';
import { getConversations, getMessages, sendMessage } from '../controllers/message.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/conversations', getConversations);
router.get('/:otherUserId', getMessages);
router.post('/', sendMessage);

export default router;
