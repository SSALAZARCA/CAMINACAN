import { Router } from 'express';
import { getAllWalkers, getWalkerById, updateWalkerProfile, registerWalker, updateWalkerStatus, deleteWalker, uploadGalleryPhoto } from '../controllers/walker.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../utils/storage';

const router = Router();

router.get('/', getAllWalkers);
router.get('/:id', getWalkerById);
router.put('/profile', authenticate, updateWalkerProfile);
router.post('/gallery', authenticate, upload.single('photo'), uploadGalleryPhoto);

router.post('/register', upload.fields([
    { name: 'idCard', maxCount: 1 },
    { name: 'policeRecord', maxCount: 1 },
    { name: 'certificate', maxCount: 1 }
]), registerWalker);

router.patch('/:id/status', authenticate, updateWalkerStatus);
router.delete('/:id', authenticate, deleteWalker);

export default router;
