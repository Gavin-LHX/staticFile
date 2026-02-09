import { Router } from 'express';
import { uploadFile, getFiles, getFile, deleteFile, updateFile, getStats } from '../controllers/fileController';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/upload', authenticateToken, upload.single('file'), uploadFile);
router.get('/', authenticateToken, getFiles);
router.get('/stats', authenticateToken, getStats);
router.get('/:id', authenticateToken, getFile);
router.put('/:id', authenticateToken, updateFile);
router.delete('/:id', authenticateToken, deleteFile);

export default router;
