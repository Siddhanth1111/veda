import { Router } from 'express';
import { createAssignment, getAssignmentInfo, getAllAssignments, deleteAssignment } from '../controllers/assignment.controller';

const router = Router();

router.post('/', createAssignment);
router.get('/', getAllAssignments);
router.get('/:id', getAssignmentInfo);
router.delete('/:id', deleteAssignment);

export default router;
