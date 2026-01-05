import { Router } from 'express';
import { createBooking, getMyBookings, updateBookingStatus, updateLiveTracking, uploadBookingPhoto } from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../utils/storage';

const router = Router();

router.use(authenticate);

router.get('/', getMyBookings);

import { validate } from '../middleware/validate.middleware';
import { bookingSchema } from '../utils/schemas';

router.post('/', validate(bookingSchema), createBooking);
router.patch('/:id/status', updateBookingStatus);
router.patch('/:id/live', updateLiveTracking);
router.post('/:id/photos', upload.single('photo'), uploadBookingPhoto);

export default router;
