import { Router } from 'express';
import { addNote, getNotes } from '../controllers/note.controller';
import { protect } from '../middleware/auth.middleware';
const router = Router();

router.post('/',protect, addNote)
router.get('/', protect, getNotes);

export default router;