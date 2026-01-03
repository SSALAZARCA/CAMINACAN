import { Router } from 'express';
import { createReview } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();


import { validate } from '../middleware/validate.middleware';
import { reviewSchema } from '../utils/schemas';

router.post('/', authenticate, validate(reviewSchema), createReview);

export default router;
