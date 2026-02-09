import { Response } from 'express';
import db from '../models/database';
import { isFileExpired } from '../utils/helpers';
import fs from 'fs';

export const getFileByShortLink = (req: any, res: Response) => {
  const { shortLink } = req.params;
  const { password } = req.query;

  try {
    const file = db.prepare('SELECT * FROM files WHERE shortLink = ?').get(shortLink) as any;

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (isFileExpired(new Date(file.expiresAt))) {
      return res.status(410).json({ error: 'File has expired' });
    }

    if (file.password && file.password !== password) {
      return res.status(403).json({ error: 'Password required' });
    }

    res.json({
      id: file.id,
      originalName: file.originalName,
      fileSize: file.fileSize,
      mimeType: file.mimeType,
      hasPassword: !!file.password,
      expiresAt: file.expiresAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch file' });
  }
};

export const downloadFile = (req: any, res: Response) => {
  const { shortLink } = req.params;
  const { password } = req.query;

  try {
    const file = db.prepare('SELECT * FROM files WHERE shortLink = ?').get(shortLink) as any;

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (isFileExpired(new Date(file.expiresAt))) {
      return res.status(410).json({ error: 'File has expired' });
    }

    if (file.password && file.password !== password) {
      return res.status(403).json({ error: 'Invalid password' });
    }

    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    db.prepare('UPDATE files SET downloadCount = downloadCount + 1 WHERE id = ?').run(file.id);

    res.download(file.filePath, file.originalName);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download file' });
  }
};

export const generateQRCode = async (req: any, res: Response) => {
  const { shortLink } = req.params;
  const baseUrl = process.env.BASE_URL || 'http://localhost:3001';

  try {
    const file = db.prepare('SELECT * FROM files WHERE shortLink = ?').get(shortLink) as any;

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const QRCode = require('qrcode');
    const downloadUrl = `${baseUrl}/download/${shortLink}`;
    const qrCode = await QRCode.toDataURL(downloadUrl);

    res.json({ qrCode, downloadUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};
