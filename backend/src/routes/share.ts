import { Router } from 'express';
import { getFileByShortLink, downloadFile, generateQRCode } from '../controllers/shareController';

const router = Router();

router.get('/:shortLink', getFileByShortLink);
router.get('/download/:shortLink', downloadFile);
router.get('/qrcode/:shortLink', generateQRCode);

export default router;
