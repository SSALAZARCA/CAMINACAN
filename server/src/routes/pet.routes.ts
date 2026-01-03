import { Router } from 'express';
import { createPet, getMyPets, deletePet } from '../controllers/pet.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getMyPets);
router.post('/', createPet);
router.delete('/:id', deletePet);

export default router;
