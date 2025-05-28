import { Router } from 'express';
import { submitAdmission, getAllAdmissions, getAdmissionById } from '../controllers/admissionController';
import { upload } from '../middleware/multer';

const router = Router();

// Create admission
router.post(
  '/',
  upload.fields([
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'studentSignature', maxCount: 1 },
    { name: 'parentGuardianSignature', maxCount: 1 },
  ]),
  submitAdmission
);

// Get all admissions
router.get('/', getAllAdmissions);

// Get admission by ID
router.get('/:id', getAdmissionById);

export default router;